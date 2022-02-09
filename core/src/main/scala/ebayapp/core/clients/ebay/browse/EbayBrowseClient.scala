package ebayapp.core.clients.ebay.browse

import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.HttpClient
import ebayapp.core.common.{Cache, Logger}
import ebayapp.core.common.config.EbayConfig
import responses.{EbayBrowseResult, EbayItem, EbayItemSummary}
import ebayapp.kernel.errors.AppError
import sttp.client3.*
import sttp.client3.circe.*
import sttp.model.{HeaderNames, MediaType, StatusCode}

import scala.concurrent.duration.*

private[ebay] trait EbayBrowseClient[F[_]] extends HttpClient[F] {
  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]]
  def getItem(accessToken: String, itemId: String): F[Option[EbayItem]]
}

final private[ebay] class LiveEbayBrowseClient[F[_]](
    private val config: EbayConfig,
    override protected val backend: SttpBackend[F, Any],
    private val itemsCache: Cache[F, String, EbayItem]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends EbayBrowseClient[F] {

  override protected val name: String                         = "ebay-browse"
  override protected val delayBetweenFailures: FiniteDuration = 1.second

  private val expiredStatuses = Set(StatusCode.TooManyRequests, StatusCode.Forbidden, StatusCode.Unauthorized)

  private val headers: Map[String, String] = Map(
    "X-EBAY-C-MARKETPLACE-ID" -> "EBAY_GB",
    HeaderNames.Accept        -> MediaType.ApplicationJson.toString(),
    HeaderNames.ContentType   -> MediaType.ApplicationJson.toString()
  )

  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]] =
    dispatchReq {
      basicRequest
        .headers(headers)
        .auth
        .bearer(accessToken)
        .get(uri"${config.baseUri}/buy/browse/v1/item_summary/search?$queryParams")
        .response(asJson[EbayBrowseResult])
    }.flatMap { r =>
      r.body match {
        case Right(value) =>
          F.pure(value.itemSummaries.getOrElse(Nil))
        case Left(DeserializationException(body, error)) =>
          logger.error(s"ebay-browse-search/parsing-error: ${error.getMessage}, \n$body") *>
            F.pure(Nil)
        case Left(HttpError(_, status)) if expiredStatuses.contains(status) =>
          F.raiseError(AppError.Auth(s"ebay account has expired: ${r.code}"))
        case Left(error) =>
          logger.error(s"ebay-browse-search/${r.code.code}: ${error.getMessage}\n$error") *>
            F.sleep(5.seconds) *> search(accessToken, queryParams)
      }
    }

  def getItem(accessToken: String, itemId: String): F[Option[EbayItem]] =
    itemsCache.get(itemId).flatMap {
      case None       => findItem(accessToken, itemId)
      case Some(item) => F.pure(Some(item))
    }

  private def findItem(accessToken: String, itemId: String): F[Option[EbayItem]] =
    dispatchReq {
      basicRequest
        .headers(headers)
        .auth
        .bearer(accessToken)
        .get(uri"${config.baseUri}/buy/browse/v1/item/$itemId")
        .response(asJson[EbayItem])
    }.flatMap { r =>
      r.body match {
        case Right(item) =>
          itemsCache.put(itemId, item).as(Some(item))
        case Left(DeserializationException(body, error)) =>
          logger.error(s"ebay-browse-get-item/parsing-error: ${error.getMessage}, \n$body") *>
            F.pure(None)
        case Left(HttpError(_, StatusCode.NotFound)) =>
          F.pure(None)
        case Left(HttpError(_, status)) if expiredStatuses.contains(status) =>
          F.raiseError(AppError.Auth(s"ebay account has expired: ${r.code}"))
        case Left(error) =>
          logger.error(s"ebay-browse-get-item/${r.code.code}: ${error.getMessage}\n$error") *>
            F.sleep(5.seconds) *> findItem(accessToken, itemId)
      }
    }
}

private[ebay] object EbayBrowseClient {

  def make[F[_]: Logger: Temporal](
      config: EbayConfig,
      backend: SttpBackend[F, Any]
  ): F[EbayBrowseClient[F]] =
    Cache
      .make[F, String, EbayItem](2.hours, 5.minutes)
      .map(cache => new LiveEbayBrowseClient[F](config, backend, cache))
}
