package ebayapp.clients.ebay.browse

import cats.effect.Sync
import cats.implicits._
import io.chrisdavenport.log4cats.Logger
import ebayapp.common.config.EbayConfig
import io.circe.generic.auto._
import responses.{EbayBrowseResult, EbayItem, EbayItemSummary}
import ebayapp.common.errors.AppError
import sttp.client._
import sttp.client.circe._
import sttp.model.{HeaderNames, MediaType, StatusCode}

private[ebay] trait EbayBrowseClient[F[_]] {
  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]]
  def getItem(accessToken: String, itemId: String): F[Option[EbayItem]]
}

final private[ebay] class LiveEbayBrowseClient[F[_]](
    private val config: EbayConfig
)(implicit
    val B: SttpBackend[F, Nothing, NothingT],
    val F: Sync[F],
    val L: Logger[F]
) extends EbayBrowseClient[F] {

  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]] =
    basicRequest
      .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_GB")
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .contentType(MediaType.ApplicationJson)
      .auth
      .bearer(accessToken)
      .get(uri"${config.baseUri}/buy/browse/v1/item_summary/search?$queryParams")
      .response(asJson[EbayBrowseResult])
      .send()
      .flatMap { r =>
        r.code match {
          case status if status.isSuccess =>
            F.fromEither(r.body.map(_.itemSummaries.getOrElse(List())))
          case StatusCode.TooManyRequests | StatusCode.Forbidden | StatusCode.Unauthorized =>
            F.raiseError(AppError.Auth(s"ebay account has expired: ${r.code}"))
          case status =>
            L.error(s"error sending search request to ebay: $status\n${r.body.fold(_.toString, _.toString)}") *>
              F.raiseError(AppError.Http(status.code, s"error sending request to ebay search api: $status"))
        }
      }

  def getItem(accessToken: String, itemId: String): F[Option[EbayItem]] =
    basicRequest
      .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_GB")
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .contentType(MediaType.ApplicationJson)
      .auth
      .bearer(accessToken)
      .get(uri"${config.baseUri}/buy/browse/v1/item/$itemId")
      .response(asJson[EbayItem])
      .send()
      .flatMap { r =>
        r.code match {
          case status if status.isSuccess =>
            F.fromEither(r.body.map(_.some))
          case StatusCode.NotFound =>
            F.pure(None)
          case StatusCode.TooManyRequests | StatusCode.Forbidden | StatusCode.Unauthorized =>
            F.raiseError(AppError.Auth(s"ebay account has expired: ${r.code}"))
          case status =>
            L.error(s"error getting item from ebay: $status\n${r.body.fold(_.toString, _.toString)}") *>
              F.raiseError(AppError.Http(status.code, s"error getting item from ebay search api: $status"))
        }
      }
}

private[ebay] object EbayBrowseClient {

  def make[F[_]: Sync: Logger](
      config: EbayConfig,
      backend: SttpBackend[F, Nothing, NothingT]
  ): F[EbayBrowseClient[F]] =
    Sync[F].delay(new LiveEbayBrowseClient[F](config)(B = backend, F = Sync[F], L = Logger[F]))
}
