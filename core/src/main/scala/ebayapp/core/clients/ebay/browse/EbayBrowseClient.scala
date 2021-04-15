package ebayapp.core.clients.ebay.browse

import cats.effect.Sync
import cats.implicits._
import ebayapp.core.common.Logger
import ebayapp.core.common.config.EbayConfig
import io.circe.generic.auto._
import responses.{EbayBrowseResult, EbayItem, EbayItemSummary}
import ebayapp.core.common.errors.AppError
import sttp.client3._
import sttp.client3.circe._
import sttp.model.{HeaderNames, MediaType, StatusCode}

private[ebay] trait EbayBrowseClient[F[_]] {
  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]]
  def getItem(accessToken: String, itemId: String): F[Option[EbayItem]]
}

final private[ebay] class LiveEbayBrowseClient[F[_]](
    private val config: EbayConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    val F: Sync[F],
    val logger: Logger[F]
) extends EbayBrowseClient[F] {

  private val defaultHeaders: Map[String, String] = Map(
    "X-EBAY-C-MARKETPLACE-ID" -> "EBAY_GB",
    HeaderNames.Accept        -> MediaType.ApplicationJson.toString(),
    HeaderNames.ContentType   -> MediaType.ApplicationJson.toString()
  )

  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]] =
    basicRequest
      .headers(defaultHeaders)
      .auth
      .bearer(accessToken)
      .get(uri"${config.baseUri}/buy/browse/v1/item_summary/search?$queryParams")
      .response(asJson[EbayBrowseResult])
      .send(backend)
      .flatMap { r =>
        r.code match {
          case status if status.isSuccess =>
            F.fromEither(r.body.map(_.itemSummaries.getOrElse(List())))
          case StatusCode.TooManyRequests | StatusCode.Forbidden | StatusCode.Unauthorized =>
            F.raiseError(AppError.Auth(s"ebay account has expired: ${r.code}"))
          case status =>
            logger.warn(s"error sending search request to ebay: $status\n${r.body.fold(_.toString, _.toString)}") *>
              F.raiseError(AppError.Http(status.code, s"error sending request to ebay search api: $status"))
        }
      }

  def getItem(accessToken: String, itemId: String): F[Option[EbayItem]] =
    basicRequest
      .headers(defaultHeaders)
      .auth
      .bearer(accessToken)
      .get(uri"${config.baseUri}/buy/browse/v1/item/$itemId")
      .response(asJson[EbayItem])
      .send(backend)
      .flatMap { r =>
        r.code match {
          case status if status.isSuccess =>
            F.fromEither(r.body.map(_.some))
          case StatusCode.NotFound =>
            F.pure(None)
          case StatusCode.TooManyRequests | StatusCode.Forbidden | StatusCode.Unauthorized =>
            F.raiseError(AppError.Auth(s"ebay account has expired: ${r.code}"))
          case status =>
            logger.warn(s"error getting item from ebay: $status\n${r.body.fold(_.toString, _.toString)}") *>
              F.raiseError(AppError.Http(status.code, s"error getting item from ebay search api: $status"))
        }
      }
}

private[ebay] object EbayBrowseClient {

  def make[F[_]: Sync: Logger](
      config: EbayConfig,
      backend: SttpBackend[F, Any]
  ): F[EbayBrowseClient[F]] =
    Sync[F].delay(new LiveEbayBrowseClient[F](config, backend))
}
