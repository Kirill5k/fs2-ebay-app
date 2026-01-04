package ebayapp.core.clients.ebay.auth

import cats.effect.std.Semaphore
import cats.effect.{Ref, Temporal}
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.option.*
import cats.syntax.applicative.*
import ebayapp.core.common.{Logger, RetailConfigProvider}
import EbayAuthClient.OAuthToken
import ebayapp.core.clients.Fs2HttpClient
import responses.{EbayAuthErrorResponse, EbayAuthSuccessResponse}
import ebayapp.core.common.config.{EbayConfig, OAuthCredentials}
import kirill5k.common.cats.Clock
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.*
import sttp.client4.circe.*
import sttp.model.{HeaderNames, MediaType, StatusCode}

import java.time.Instant
import scala.concurrent.duration.*

private[ebay] trait EbayAuthClient[F[_]]:
  def accessToken: F[String]
  def switchAccount(): F[Unit]

final private[ebay] class LiveEbayAuthClient[F[_]: Temporal](
    private val config: EbayConfig,
    private val token: Ref[F, Option[OAuthToken]],
    private val credentials: Ref[F, List[OAuthCredentials]],
    private val semaphore: Semaphore[F],
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]]
)(using
    logger: Logger[F],
    clock: Clock[F]
) extends EbayAuthClient[F] with Fs2HttpClient[F] {

  override protected val name: String = "ebay-auth"

  private def validAccessToken: F[Option[OAuthToken]] =
    for
      tok <- token.get
      now <- clock.now
      validToken = tok.filter(_.isValid(now))
    yield validToken

  def accessToken: F[String] =
    validAccessToken.flatMap {
      case Some(t) => t.token.pure[F]
      case None    =>
        semaphore.permit.use { _ =>
          validAccessToken.flatMap {
            case Some(t) => t.token.pure[F]
            case None    => authenticate.flatTap(t => token.set(t.some)).map(_.token)
          }
        }
    }

  def switchAccount(): F[Unit] =
    logger.warn("switching ebay account") >>
      token.set(None) >>
      credentials.update {
        case Nil          => Nil
        case head :: tail => tail :+ head
      }

  private def authenticate: F[OAuthToken] =
    credentials.get.map(_.headOption).flatMap {
      case None =>
        logger.error("no credentials available for ebay auth") >>
          Temporal[F].raiseError(new RuntimeException("No ebay credentials configured"))
      case Some(creds) =>
        dispatch {
          basicRequest
            .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
            .contentType(MediaType.ApplicationXWwwFormUrlencoded)
            .auth
            .basic(creds.clientId.trim, creds.clientSecret.trim)
            .post(uri"${config.baseUri}/identity/v1/oauth2/token")
            .body(Map("scope" -> "https://api.ebay.com/oauth/api_scope", "grant_type" -> "client_credentials"))
            .response(asJsonEither[EbayAuthErrorResponse, EbayAuthSuccessResponse])
        }.flatMap { r =>
          r.body match
            case Right(EbayAuthSuccessResponse(token, expiresIn, _)) =>
              clock.now.map(now => OAuthToken(token, now.plusSeconds(expiresIn - 30)))
            case Left(ResponseException.UnexpectedStatusCode(_, meta)) if meta.code == StatusCode.TooManyRequests =>
              logger.warn(s"reached api calls limit (cid - ${creds.clientId})") >>
                switchAccount() >> authenticate
            case Left(ResponseException.UnexpectedStatusCode(error, meta)) if meta.code == StatusCode.Unauthorized =>
              logger.warn(s"unauthorized: ${error.error_description} (cid - ${creds.clientId})") >>
                switchAccount() >> authenticate
            case Left(ResponseException.UnexpectedStatusCode(error, meta)) =>
              logger.error(s"http error authenticating with ebay ${meta.code}: ${error.error_description} (cid - ${creds.clientId})") >>
                clock.sleep(1.second) >> authenticate
            case Left(error) =>
              logger.error(s"unexpected error authenticating with ebay: ${error.getMessage}") >>
                clock.sleep(1.second) >> authenticate
        }
    }
}

private[ebay] object EbayAuthClient:

  final private[auth] case class OAuthToken(token: String, expiresAt: Instant) {
    def isValid(now: Instant): Boolean = expiresAt.isAfter(now)
  }

  def make[F[_]: {Temporal, Logger, Clock}](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  ): F[EbayAuthClient[F]] =
    for
      config    <- configProvider.ebay
      token     <- Ref.of[F, Option[OAuthToken]](None)
      creds     <- Ref.of[F, List[OAuthCredentials]](config.credentials)
      semaphore <- Semaphore[F](1)
    yield LiveEbayAuthClient[F](config, token, creds, semaphore, backend)
