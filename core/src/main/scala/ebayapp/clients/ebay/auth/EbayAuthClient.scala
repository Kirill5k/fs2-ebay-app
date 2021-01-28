package ebayapp.clients.ebay.auth

import java.time.Instant

import cats.effect.{Sync, Timer}
import cats.effect.concurrent.Ref
import cats.implicits._
import ebayapp.common.Logger
import io.circe.generic.auto._
import io.circe.parser._
import EbayAuthClient.{EbayAuthToken, ExpiredToken}
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

final private[ebay] class LiveEbayAuthClient[F[_]](
    private val config: EbayConfig,
    private val authToken: Ref[F, EbayAuthToken],
    private val credentials: Ref[F, List[EbayCredentials]],
    private val backend: SttpBackend[F, Any]
)(implicit
  val F: Sync[F],
  val L: Logger[F],
  val T: Timer[F]
) extends EbayAuthClient[F] {

  def accessToken: F[String] =
    for {
      token      <- authToken.get
      validToken <- if (token.isValid) F.pure(token) else authenticate().flatTap(authToken.set)
    } yield validToken.token

  def switchAccount(): F[Unit] =
    L.warn("switching ebay account") *>
      authToken.set(ExpiredToken) *>
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
        .response(asJson[EbayAuthSuccessResponse])
        .send(backend)
        .flatMap { r =>
          r.body match {
            case Right(token) =>
              F.pure(EbayAuthToken(token.access_token, token.expires_in))
            case Left(HttpError(_, StatusCode.TooManyRequests)) =>
              L.error(s"reached api calls limit (cid - ${creds.clientId})") *>
                switchAccount() *> authenticate()
            case Left(HttpError(body, StatusCode.Unauthorized)) =>
              L.error(s"unauthorized: ${errorMessage(body)} (cid - ${creds.clientId})") *>
                switchAccount() *> authenticate()
            case Left(HttpError(body, status)) =>
              val message = errorMessage(body)
              L.error(s"http error authenticating with ebay ${status.code}: $message (cid - ${creds.clientId})") *>
                T.sleep(1.second) *> authenticate()
            case Left(error) =>
              L.error(s"unexpected error authenticating with ebay: ${error.getMessage}") *>
                T.sleep(1.second) *> authenticate()

          }
        }
    }

  private def errorMessage(json: String): String =
    decode[EbayAuthErrorResponse](json).fold(_ => json, e => s"${e.error}: ${e.error_description}")
}

private[ebay] object EbayAuthClient {
  private[auth] val ExpiredToken = EbayAuthToken("expired", 0)

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
  ): F[EbayAuthClient[F]] = {
    val token = Ref.of[F, EbayAuthToken](EbayAuthToken("expired", 0))
    val creds = Ref.of[F, List[EbayCredentials]](config.credentials)
    (token, creds).mapN { case (t, c) =>
      new LiveEbayAuthClient[F](config, t, c, backend)
    }
  }
}
