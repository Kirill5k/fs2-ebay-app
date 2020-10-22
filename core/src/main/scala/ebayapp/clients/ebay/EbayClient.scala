package ebayapp.clients.ebay

import java.time.Instant
import java.time.temporal.ChronoField.MILLI_OF_SECOND

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.ebay.auth.EbayAuthClient
import ebayapp.clients.ebay.browse.EbayBrowseClient
import ebayapp.clients.ebay.browse.responses.{EbayItem, EbayItemSummary}
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.Cache
import ebayapp.common.config.EbayConfig
import ebayapp.common.errors.ApplicationError
import ebayapp.domain.search.SearchQuery
import ebayapp.domain.{ItemDetails, ResellableItem}
import io.chrisdavenport.log4cats.Logger

import scala.concurrent.duration.FiniteDuration

trait EbayClient[F[_]] {
  def findLatestItems[D <: ItemDetails](
      query: SearchQuery,
      duration: FiniteDuration
  )(
      implicit mapper: EbayItemMapper[D],
      params: EbaySearchParams[D]
  ): fs2.Stream[F, ResellableItem[D]]
}

final private[ebay] class LiveEbayClient[F[_]](
    private val config: EbayConfig,
    private val authClient: EbayAuthClient[F],
    private val browseClient: EbayBrowseClient[F],
    private val itemIdsCache: Cache[F, String, Unit]
)(
    implicit val S: Sync[F],
    val L: Logger[F]
) extends EbayClient[F] {

  def findLatestItems[D <: ItemDetails](
      query: SearchQuery,
      duration: FiniteDuration
  )(
      implicit mapper: EbayItemMapper[D],
      params: EbaySearchParams[D]
  ): fs2.Stream[F, ResellableItem[D]] = {
    val time   = Instant.now.minusMillis(duration.toMillis).`with`(MILLI_OF_SECOND, 0)
    val filter = params.searchFilterTemplate.format(time).replaceAll("\\{", "%7B").replaceAll("}", "%7D")
    val searchParams = Map(
      "category_ids" -> params.categoryId.toString,
      "filter"       -> filter,
      "limit"        -> "200",
      "q"            -> query.value
    )

    fs2
      .Stream(searchParams)
      .map(searchForItems(params.removeUnwanted))
      .flatMap(fs2.Stream.evalSeq)
      .evalTap(item => itemIdsCache.put(item.itemId, ()))
      .map(mapper.toDomain)
      .handleErrorWith(switchAccountIfItHasExpired)
  }

  private def searchForItems(
      removeUnwanted: EbayItemSummary => Boolean
  )(
      searchParams: Map[String, String]
  ): F[List[EbayItem]] =
    for {
      token <- authClient.accessToken
      all   <- browseClient.search(token, searchParams)
      valid = all.filter(hasTrustedSeller).filter(removeUnwanted)
      complete <- valid.traverse(getCompleteItem).map(_.flatten)
      _        <- L.info(s"search ${searchParams("q")} returned ${complete.size} new items (total - ${all.size})")
    } yield complete

  private def getCompleteItem(itemSummary: EbayItemSummary): F[Option[EbayItem]] =
    itemIdsCache.contains(itemSummary.itemId).flatMap {
      case false => authClient.accessToken.flatMap(t => browseClient.getItem(t, itemSummary.itemId))
      case true  => S.pure(None)
    }

  private val hasTrustedSeller: EbayItemSummary => Boolean = itemSummary =>
    (for {
      feedbackPercentage <- itemSummary.seller.feedbackPercentage
      if feedbackPercentage > config.search.minFeedbackPercentage
      feedbackScore <- itemSummary.seller.feedbackScore
      if feedbackScore > config.search.minFeedbackScore
    } yield ()).isDefined

  private def switchAccountIfItHasExpired[D <: ItemDetails]: PartialFunction[Throwable, fs2.Stream[F, ResellableItem[D]]] = {
    case ApplicationError.Auth(message) =>
      fs2.Stream.eval {
        L.warn(s"auth error from ebay client, switching account: $message") *>
          authClient.switchAccount()
      }.drain
    case error: ApplicationError =>
      fs2.Stream
        .eval(L.error(s"api client error while getting items from ebay: ${error.message}"))
        .drain
    case error =>
      fs2.Stream
        .eval(L.error(error)(s"unexpected error while getting items from ebay: ${error.getMessage}"))
        .drain
  }
}

object EbayClient {}
