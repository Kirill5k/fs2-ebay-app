package ebayapp.proxy.common

import cats.effect.{Async, Resource, Sync}
import cats.syntax.apply.*
import ebayapp.proxy.common.config.{AppConfig, ClientConfig}
import org.http4s.client.Client
import org.http4s.blaze.client.BlazeClientBuilder
import org.http4s.client.middleware.FollowRedirect
import org.http4s.jdkhttpclient.JdkHttpClient

import java.net.http.HttpClient
import java.net.{InetSocketAddress, ProxySelector}
import java.time.Duration as JDuration
import scala.concurrent.duration.*

trait Resources[F[_]]:
  def blazeClient: Client[F]
  def jdkHttpClient: Client[F]

object Resources:

  def make[F[_]: Async](config: AppConfig): Resource[F, Resources[F]] =
    (makeBlazeClient[F](config.client), makeJdkHttpClient[F](config.client)).mapN { (blaze, jdkHttp) =>
      new Resources[F] {
        def blazeClient: Client[F]   = FollowRedirect(10)(blaze)
        def jdkHttpClient: Client[F] = FollowRedirect(10)(jdkHttp)
      }
    }

  private def makeBlazeClient[F[_]: Async](config: ClientConfig): Resource[F, Client[F]] =
    BlazeClientBuilder[F]
      .withBufferSize(1024 * 200)
      .withMaxWaitQueueLimit(256 * 10)
      .withMaxTotalConnections(256 * 10)
      .withConnectTimeout(config.connectTimeout)
      .withResponseHeaderTimeout(1.minutes)
      .withRequestTimeout(Duration.Inf)
      .withIdleTimeout(Duration.Inf)
      .resource

  private def makeJdkHttpClient[F[_]: Async](config: ClientConfig): Resource[F, Client[F]] =
    Resource.eval(defaultHttpClient[F](config)).flatMap(JdkHttpClient(_))

  private def defaultHttpClient[F[_]](config: ClientConfig)(implicit F: Sync[F]): F[HttpClient] =
    F.delay {
      val builder = HttpClient.newBuilder()
      // workaround for https://github.com/http4s/http4s-jdk-http-client/issues/200
      if (Runtime.version().feature() == 11) {
        val params = javax.net.ssl.SSLContext.getDefault.getDefaultSSLParameters
        params.setProtocols(params.getProtocols.filter(_ != "TLSv1.3"))
        builder.sslParameters(params)
      }
      builder
        .proxy(ProxySelector.of(new InetSocketAddress(config.proxyHost, config.proxyPort)))
        .connectTimeout(JDuration.ofMillis(config.connectTimeout.toMillis))
        .build()
    }
