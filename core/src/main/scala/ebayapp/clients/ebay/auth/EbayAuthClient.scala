package ebayapp.clients.ebay.auth

import java.time.Instant

import cats.effect.{Sync, Timer}
import cats.effect.concurrent.Ref
import cats.implicits._
import ebayapp.common.Logger
import io.circe.generic.auto._
import EbayAuthClient.EbayAuthToken
import responses.{EbayAuthErrorResponse, EbayAuthSuccessResponse}
import ebayapp.common.config.{EbayConfig, EbayCredentials}
import sttp.client3._
import sttp.client3.circe._
import sttp.model.{HeaderNames, MediaType, StatusCode}

import scala.concurrent.duration._

private[ebay] trait EbayAuthClient[F[_]] {
  def accessToken: F[String]
  def switchAccount(): F[Unit]
}

final private[ebay] class LiveEbayAuthClient[F[_]: Sync](
    private val config: EbayConfig,
    private val authToken: Ref[F, Option[EbayAuthToken]],
    private val credentials: Ref[F, List[EbayCredentials]],
    private val backend: SttpBackend[F, Any]
)(implicit
    val L: Logger[F],
    val T: Timer[F]
) extends EbayAuthClient[F] {

  def accessToken: F[String] =
    authToken.get
      .flatMap {
        case Some(t) if t.isValid => t.pure[F]
        case _                    => authenticate().flatTap(t => authToken.set(Some(t)))
      }
      .map(_.token)

  def switchAccount(): F[Unit] =
    L.warn("switching ebay account") *>
      authToken.set(None) *>
      credentials.update(creds => creds.tail :+ creds.head)

  private def authenticate(): F[EbayAuthToken] =
    credentials.get.map(_.head).flatMap { creds =>
      basicRequest
        .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
        .contentType(MediaType.ApplicationXWwwFormUrlencoded)
        .auth
        .basic(creds.clientId.trim, creds.clientSecret.trim)
        .post(uri"${config.baseUri}/identity/v1/oauth2/token")
        .body(Map("scope" -> "https://api.ebay.com/oauth/api_scope", "grant_type" -> "client_credentials"))
        .response(asJsonEither[EbayAuthErrorResponse, EbayAuthSuccessResponse])
        .send(backend)
        .flatMap { r =>
          r.body match {
            case Right(token) =>
              EbayAuthToken(token.access_token, token.expires_in).pure[F]
            case Left(HttpError(_, StatusCode.TooManyRequests)) =>
              L.error(s"reached api calls limit (cid - ${creds.clientId})") *>
                switchAccount() *> authenticate()
            case Left(HttpError(error, StatusCode.Unauthorized)) =>
              L.error(s"unauthorized: ${error.error_description} (cid - ${creds.clientId})") *>
                switchAccount() *> authenticate()
            case Left(HttpError(error, status)) =>
              L.error(s"http error authenticating with ebay ${status.code}: ${error.error_description} (cid - ${creds.clientId})") *>
                T.sleep(1.second) *> authenticate()
            case Left(error) =>
              L.error(s"unexpected error authenticating with ebay: ${error.getMessage}") *>
                T.sleep(1.second) *> authenticate()

          }
        }
    }
}

private[ebay] object EbayAuthClient {

  private[auth] case class EbayAuthToken(token: String, expiresAt: Instant) {
    def isValid: Boolean = expiresAt.isAfter(Instant.now())
  }

  private[auth] object EbayAuthToken {
    def apply(token: String, expiresIn: Long, precisionError: FiniteDuration = 15.seconds): EbayAuthToken =
      new EbayAuthToken(token, Instant.now().plusSeconds(expiresIn).minusSeconds(precisionError.toSeconds))
  }

  def make[F[_]: Sync: Logger: Timer](
      config: EbayConfig,
      backend: SttpBackend[F, Any]
  ): F[EbayAuthClient[F]] =
    (
      Ref.of[F, Option[EbayAuthToken]](None),
      Ref.of[F, List[EbayCredentials]](config.credentials)
    ).mapN((t, c) => new LiveEbayAuthClient[F](config, t, c, backend))
}
