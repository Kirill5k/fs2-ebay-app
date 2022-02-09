package ebayapp.core.clients.ebay.auth

import cats.effect.{Ref, Temporal}
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.option.*
import cats.syntax.apply.*
import cats.syntax.applicative.*
import ebayapp.core.common.Logger
import EbayAuthClient.EbayAuthToken
import ebayapp.core.clients.HttpClient
import responses.{EbayAuthErrorResponse, EbayAuthSuccessResponse}
import ebayapp.core.common.config.{EbayConfig, EbayCredentials}
import sttp.client3.*
import sttp.client3.circe.*
import sttp.model.{HeaderNames, MediaType, StatusCode}

import java.time.Instant
import scala.concurrent.duration.*

private[ebay] trait EbayAuthClient[F[_]] extends HttpClient[F] {
  def accessToken: F[String]
  def switchAccount(): F[Unit]
}

final private[ebay] class LiveEbayAuthClient[F[_]](
    private val config: EbayConfig,
    private val authToken: Ref[F, Option[EbayAuthToken]],
    private val credentials: Ref[F, List[EbayCredentials]],
    override protected val backend: SttpBackend[F, Any]
)(using
    val logger: Logger[F],
    val T: Temporal[F]
) extends EbayAuthClient[F] {

  override protected val name: String                         = "ebay-auth"
  override protected val delayBetweenFailures: FiniteDuration = 1.second

  def accessToken: F[String] =
    authToken.get
      .flatMap {
        case Some(t) if t.isValid => t.pure[F]
        case _                    => authenticate().flatTap(t => authToken.set(t.some))
      }
      .map(_.token)

  def switchAccount(): F[Unit] =
    logger.warn("switching ebay account") *>
      authToken.set(None) *>
      credentials.update(creds => creds.tail :+ creds.head)

  private def authenticate(): F[EbayAuthToken] =
    credentials.get.map(_.head).flatMap { creds =>
      dispatchReq {
        basicRequest
          .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
          .contentType(MediaType.ApplicationXWwwFormUrlencoded)
          .auth
          .basic(creds.clientId.trim, creds.clientSecret.trim)
          .post(uri"${config.baseUri}/identity/v1/oauth2/token")
          .body(Map("scope" -> "https://api.ebay.com/oauth/api_scope", "grant_type" -> "client_credentials"))
          .response(asJsonEither[EbayAuthErrorResponse, EbayAuthSuccessResponse])
      }.flatMap { r =>
        r.body match {
          case Right(token) =>
            EbayAuthToken(token.access_token, token.expires_in).pure[F]
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"reached api calls limit (cid - ${creds.clientId})") *>
              switchAccount() *> authenticate()
          case Left(HttpError(error, StatusCode.Unauthorized)) =>
            logger.warn(s"unauthorized: ${error.error_description} (cid - ${creds.clientId})") *>
              switchAccount() *> authenticate()
          case Left(HttpError(error, status)) =>
            logger.error(s"http error authenticating with ebay ${status.code}: ${error.error_description} (cid - ${creds.clientId})") *>
              T.sleep(1.second) *> authenticate()
          case Left(error) =>
            logger.error(s"unexpected error authenticating with ebay: ${error.getMessage}") *>
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

  def make[F[_]: Temporal: Logger](
      config: EbayConfig,
      backend: SttpBackend[F, Any]
  ): F[EbayAuthClient[F]] =
    (
      Ref.of[F, Option[EbayAuthToken]](None),
      Ref.of[F, List[EbayCredentials]](config.credentials)
    ).mapN((t, c) => new LiveEbayAuthClient[F](config, t, c, backend))
}
