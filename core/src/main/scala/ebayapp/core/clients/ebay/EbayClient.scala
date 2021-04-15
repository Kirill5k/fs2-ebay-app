package ebayapp.core.clients.ebay

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.core.clients.ebay.auth.EbayAuthClient
import ebayapp.core.clients.ebay.browse.EbayBrowseClient
import ebayapp.core.clients.ebay.browse.responses.{EbayItem, EbayItemSummary}
import ebayapp.core.clients.ebay.mappers.EbayItemMapper.EbayItemMapper
import ebayapp.core.clients.ebay.search.EbaySearchParams
import ebayapp.core.common.Cache
import ebayapp.core.common.config.{EbayConfig, SearchQuery}
import ebayapp.core.common.errors.AppError
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.common.Logger
import fs2._
import sttp.client3.SttpBackend

import java.time.Instant
import java.time.temporal.ChronoField.MILLI_OF_SECOND
import scala.concurrent.duration._

trait EbayClient[F[_]] {
  def latest[D <: ItemDetails](
      query: SearchQuery,
      duration: FiniteDuration
  )(implicit
      mapper: EbayItemMapper[D],
      params: EbaySearchParams[D]
  ): Stream[F, ResellableItem[D]]
}

final private[ebay] class LiveEbayClient[F[_]](
    private val config: EbayConfig,
    private val authClient: EbayAuthClient[F],
    private val browseClient: EbayBrowseClient[F],
    private val itemIdsCache: Cache[F, String, Unit]
)(implicit
    val F: Sync[F],
    val logger: Logger[F]
) extends EbayClient[F] {

  def latest[D <: ItemDetails](
      query: SearchQuery,
      duration: FiniteDuration
  )(implicit
      mapper: EbayItemMapper[D],
      params: EbaySearchParams[D]
  ): Stream[F, ResellableItem[D]] = {
    val time   = Instant.now.minusMillis(duration.toMillis).`with`(MILLI_OF_SECOND, 0)
    val filter = params.searchFilterTemplate.format(time).replaceAll("\\{", "%7B").replaceAll("}", "%7D")
    val searchParams = Map(
      "fieldgroups"  -> "EXTENDED",
      "category_ids" -> params.categoryId.toString,
      "filter"       -> filter,
      "limit"        -> "200",
      "q"            -> query.value
    )

    Stream
      .evalSeq(searchForItems(searchParams, params.filter))
      .evalTap(item => itemIdsCache.put(item.itemId, ()))
      .map(mapper.toDomain)
      .handleErrorWith(switchAccountIfItHasExpired)
  }

  private def searchForItems(searchParams: Map[String, String], itemsFilter: EbayItemSummary => Boolean): F[List[EbayItem]] =
    for {
      token <- authClient.accessToken
      all   <- browseClient.search(token, searchParams)
      valid = all.filter(_.itemGroupType.isEmpty).filter(hasTrustedSeller).filter(itemsFilter)
      complete <- valid.traverse(getCompleteItem).map(_.flatten)
      _        <- logger.info(s"""ebay-search "${searchParams("q")}" returned ${complete.size} new items (total - ${all.size})""")
    } yield complete

  private def getCompleteItem(itemSummary: EbayItemSummary): F[Option[EbayItem]] =
    itemIdsCache.contains(itemSummary.itemId).flatMap {
      case false => authClient.accessToken.flatMap(t => browseClient.getItem(t, itemSummary.itemId))
      case true  => F.pure(None)
    }

  private val hasTrustedSeller: EbayItemSummary => Boolean = is =>
    (is.seller.feedbackPercentage, is.seller.feedbackScore)
      .mapN { (percentage, score) =>
        percentage > config.search.minFeedbackPercentage && score > config.search.minFeedbackScore
      }
      .exists(identity)

  private def switchAccountIfItHasExpired[D <: ItemDetails]: PartialFunction[Throwable, Stream[F, ResellableItem[D]]] = {
    case AppError.Auth(message) =>
      Stream.eval_(logger.warn(s"auth error from ebay client ($message). switching account")) ++
        Stream.eval_(authClient.switchAccount())
    case error: AppError =>
      Stream.eval_(logger.warn(s"api client error while getting items from ebay: ${error.message}"))
    case error =>
      Stream.eval_(logger.error(error)(s"unexpected error while getting items from ebay: ${error.getMessage}"))
  }
}

object EbayClient {

  def make[F[_]: Concurrent: Logger: Timer](
      config: EbayConfig,
      backend: SttpBackend[F, Any]
  ): F[EbayClient[F]] = {
    val auth   = EbayAuthClient.make[F](config, backend)
    val browse = EbayBrowseClient.make[F](config, backend)
    val cache  = Cache.make[F, String, Unit](2.hours, 5.minutes)
    (auth, browse, cache).mapN((a, b, c) => new LiveEbayClient[F](config, a, b, c))
  }
}
