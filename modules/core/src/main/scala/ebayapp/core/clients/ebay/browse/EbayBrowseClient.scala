package ebayapp.core.clients.ebay.browse

import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.Fs2HttpClient
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.EbayConfig
import responses.{EbayBrowseResult, EbayItem, EbayItemSummary}
import ebayapp.kernel.errors.AppError
import kirill5k.common.cats.Cache
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.circe.*
import sttp.client4.*
import sttp.model.{HeaderNames, MediaType, StatusCode}

import scala.concurrent.duration.*

private[ebay] trait EbayBrowseClient[F[_]]:
  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]]
  def getItem(accessToken: String, itemId: String): F[Option[EbayItem]]

final private[ebay] class LiveEbayBrowseClient[F[_]](
    private val config: EbayConfig,
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]],
    private val itemsCache: Cache[F, String, EbayItem]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends EbayBrowseClient[F] with Fs2HttpClient[F] {

  override protected val name: String = "ebay-browse"

  private val expiredStatuses = Set(StatusCode.TooManyRequests, StatusCode.Forbidden, StatusCode.Unauthorized)

  private val headers: Map[String, String] = Map(
    "X-EBAY-C-MARKETPLACE-ID" -> "EBAY_GB",
    HeaderNames.Accept        -> MediaType.ApplicationJson.toString(),
    HeaderNames.ContentType   -> MediaType.ApplicationJson.toString()
  )

  def search(accessToken: String, queryParams: Map[String, String]): F[List[EbayItemSummary]] =
    dispatch {
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
        case Left(ResponseException.DeserializationException(body, error, _)) =>
          logger.error(s"ebay-browse-search/parsing-error: ${error.getMessage}, \n$body") *>
            F.pure(Nil)
        case Left(ResponseException.UnexpectedStatusCode(_, meta)) if expiredStatuses.contains(meta.code) =>
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
    dispatch {
      basicRequest
        .headers(headers)
        .auth
        .bearer(accessToken)
        .get(uri"${config.baseUri}/buy/browse/v1/item/$itemId")
        .response(asJson[EbayItem])
    }.flatMap { r =>
      r.body match
        case Right(item) =>
          itemsCache.put(itemId, item).as(Some(item))
        case Left(ResponseException.DeserializationException(body, error, _)) =>
          logger.error(s"ebay-browse-get-item/parsing-error: ${error.getMessage}, \n$body") *>
            F.pure(None)
        case Left(ResponseException.UnexpectedStatusCode(_, meta)) if meta.code == StatusCode.NotFound =>
          F.pure(None)
        case Left(ResponseException.UnexpectedStatusCode(_, meta)) if expiredStatuses.contains(meta.code) =>
          F.raiseError(AppError.Auth(s"ebay account has expired: ${r.code}"))
        case Left(error) =>
          logger.error(s"ebay-browse-get-item/${r.code.code}: ${error.getMessage}\n$error") *>
            F.sleep(5.seconds) *> findItem(accessToken, itemId)
    }
}

private[ebay] object EbayBrowseClient:
  def make[F[_]: {Logger, Temporal}](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  ): F[EbayBrowseClient[F]] =
    (
      configProvider.ebay,
      Cache.make[F, String, EbayItem](2.hours, 5.minutes)
    ).mapN((config, cache) => LiveEbayBrowseClient[F](config, backend, cache))
