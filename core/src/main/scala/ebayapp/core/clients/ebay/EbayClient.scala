package ebayapp.core.clients.ebay

import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.ebay.auth.EbayAuthClient
import ebayapp.core.clients.ebay.browse.EbayBrowseClient
import ebayapp.core.clients.ebay.browse.responses.{EbayItem, EbayItemSummary}
import ebayapp.core.clients.ebay.mappers.EbayItemMapper
import ebayapp.core.clients.ebay.search.EbaySearchParams
import ebayapp.core.common.Cache
import ebayapp.core.common.config.{EbayConfig, SearchCriteria}
import ebayapp.core.common.errors.AppError
import ebayapp.core.domain.{ResellableItem}
import ebayapp.core.common.Logger
import fs2._
import sttp.client3.SttpBackend

import java.time.Instant
import java.time.temporal.ChronoField.MILLI_OF_SECOND
import scala.concurrent.duration._

trait EbayClient[F[_]] {
  def search(criteria: SearchCriteria): Stream[F, ResellableItem]
}

final private[ebay] class LiveEbayClient[F[_]](
    private val config: EbayConfig,
    private val authClient: EbayAuthClient[F],
    private val browseClient: EbayBrowseClient[F],
    private val itemIdsCache: Cache[F, String, Unit]
)(implicit
    val F: Temporal[F],
    val logger: Logger[F]
) extends EbayClient[F] {

  def search(criteria: SearchCriteria): Stream[F, ResellableItem] = {
    val time = Instant.now.minusMillis(config.search.maxListingDuration.toMillis).`with`(MILLI_OF_SECOND, 0)

    for {
      kind   <- Stream.fromEither[F](criteria.itemKind.toRight(AppError.Critical("item kind is required in ebay-client")))
      params <- Stream.fromEither[F](EbaySearchParams.get(kind))
      mapper <- Stream.fromEither[F](EbayItemMapper.get(kind))
      items <- Stream
        .evalSeq(searchForItems(params.requestArgs(time, criteria.query), params.filter))
        .evalTap(item => itemIdsCache.put(item.itemId, ()))
        .map(mapper.toDomain)
        .handleErrorWith(switchAccountIfItHasExpired)
    } yield items
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

  private def switchAccountIfItHasExpired: PartialFunction[Throwable, Stream[F, ResellableItem]] = {
    case AppError.Auth(message) =>
      Stream.eval(logger.warn(s"auth error from ebay client ($message). switching account")).drain ++
        Stream.eval(authClient.switchAccount()).drain
    case AppError.Http(status, message) =>
      Stream.eval(logger.warn(s"$status api client error while getting items from ebay: $message")).drain
    case error: AppError.Critical =>
      Stream.eval(logger.critical(s"critical error while trying to get items from ebay: ${error.message}")).drain ++
        Stream.raiseError[F](error)
    case error =>
      Stream.eval(logger.error(error)(s"unexpected error while getting items from ebay: ${error.getMessage}")).drain
  }
}

object EbayClient {

  def make[F[_]: Temporal: Logger](
      config: EbayConfig,
      backend: SttpBackend[F, Any]
  ): F[EbayClient[F]] = {
    val auth   = EbayAuthClient.make[F](config, backend)
    val browse = EbayBrowseClient.make[F](config, backend)
    val cache  = Cache.make[F, String, Unit](2.hours, 5.minutes)
    (auth, browse, cache).mapN((a, b, c) => new LiveEbayClient[F](config, a, b, c))
  }
}
