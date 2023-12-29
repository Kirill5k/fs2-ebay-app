package ebayapp.proxy.common

import cats.effect.{Async, Resource, Sync}
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import ebayapp.kernel.config.ClientConfig
import ebayapp.kernel.errors.AppError
import ebayapp.proxy.common.config.AppConfig
import fs2.io.net.Network
import org.http4s.client.Client
import org.http4s.ember.client.EmberClientBuilder
import org.http4s.client.middleware.FollowRedirect
import org.http4s.jdkhttpclient.JdkHttpClient

import java.net.http.HttpClient
import java.net.{InetSocketAddress, ProxySelector}
import java.time.Duration as JDuration
import scala.concurrent.duration.*

trait Resources[F[_]]:
  def emberClient: Client[F]
  def jdkHttpClient: Client[F]

object Resources:

  def make[F[_]: Async](config: AppConfig): Resource[F, Resources[F]] =
    (makeEmberClient[F](config.client), makeJdkHttpClient[F](config.client)).mapN { (blaze, jdkHttp) =>
      new Resources[F] {
        def emberClient: Client[F]   = FollowRedirect(10)(blaze)
        def jdkHttpClient: Client[F] = FollowRedirect(10)(jdkHttp)
      }
    }

  private def makeEmberClient[F[_]](config: ClientConfig)(using F: Async[F]): Resource[F, Client[F]] =
    EmberClientBuilder
      .default[F](F, Network.forAsync[F])
      .withMaxTotal(256 * 10)
      .withTimeout(config.connectTimeout)
      .withIdleConnectionTime(Duration.Inf)
      .build

  private def makeJdkHttpClient[F[_]: Async](config: ClientConfig): Resource[F, Client[F]] =
    Resource.eval(defaultHttpClient[F](config)).map(JdkHttpClient(_))

  private def defaultHttpClient[F[_]](config: ClientConfig)(using F: Sync[F]): F[HttpClient] =
    F.raiseWhen(config.proxyPort.isEmpty || config.proxyHost.isEmpty)(AppError.Critical("Missing proxy config")) >>
      F.delay {
        val builder = HttpClient.newBuilder()
        // workaround for https://github.com/http4s/http4s-jdk-http-client/issues/200
        if (Runtime.version().feature() == 11) {
          val params = javax.net.ssl.SSLContext.getDefault.getDefaultSSLParameters
          params.setProtocols(params.getProtocols.filter(_ != "TLSv1.3"))
          val _ = builder.sslParameters(params)
        }
        builder
          .proxy(ProxySelector.of(new InetSocketAddress(config.proxyHost.get, config.proxyPort.get)))
          .connectTimeout(JDuration.ofMillis(config.connectTimeout.toMillis))
          .build()
      }
