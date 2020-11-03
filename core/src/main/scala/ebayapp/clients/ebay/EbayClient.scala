package ebayapp.clients.ebay

import java.time.Instant
import java.time.temporal.ChronoField.MILLI_OF_SECOND

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.ebay.auth.EbayAuthClient
import ebayapp.clients.ebay.browse.EbayBrowseClient
import ebayapp.clients.ebay.browse.responses.{EbayItem, EbayItemSummary}
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.Cache
import ebayapp.common.config.{EbayConfig, SearchQuery}
import ebayapp.common.errors.AppError
import ebayapp.domain.{ItemDetails, ResellableItem}
import io.chrisdavenport.log4cats.Logger
import sttp.client.{NothingT, SttpBackend}

import scala.concurrent.duration._

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
      "fieldgroups" -> "EXTENDED",
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
      _        <- L.info(s"""ebay-search "${searchParams("q")}" returned ${complete.size} new items (total - ${all.size})""")
    } yield complete

  private def getCompleteItem(itemSummary: EbayItemSummary): F[Option[EbayItem]] =
    itemIdsCache.contains(itemSummary.itemId).flatMap {
      case false => authClient.accessToken.flatMap(t => browseClient.getItem(t, itemSummary.itemId))
      case true  => S.pure(None)
    }

  private val hasTrustedSeller: EbayItemSummary => Boolean = itemSummary =>
    (for {
      feedbackPercentage <- itemSummary.seller.feedbackPercentage
      goodPercentage = feedbackPercentage > config.search.minFeedbackPercentage
      feedbackScore <- itemSummary.seller.feedbackScore
      goodScore = feedbackScore > config.search.minFeedbackScore
    } yield goodPercentage && goodScore).exists(identity)

  private def switchAccountIfItHasExpired[D <: ItemDetails]: PartialFunction[Throwable, fs2.Stream[F, ResellableItem[D]]] = {
    case AppError.Auth(message) =>
      fs2.Stream.eval {
        L.warn(s"auth error from ebay client ($message). switching account") *>
          authClient.switchAccount()
      }.drain
    case error: AppError =>
      fs2.Stream
        .eval(L.error(s"api client error while getting items from ebay: ${error.message}"))
        .drain
    case error =>
      fs2.Stream
        .eval(L.error(error)(s"unexpected error while getting items from ebay: ${error.getMessage}"))
        .drain
  }
}

object EbayClient {

  def make[F[_]: Concurrent: Logger: Timer](
      config: EbayConfig,
      backend: SttpBackend[F, Nothing, NothingT]
  ): F[EbayClient[F]] = {
    val auth = EbayAuthClient.make[F](config, backend)
    val browse = EbayBrowseClient.make[F](config, backend)
    val cache = Cache.make[F, String, Unit](2.hours, 5.minutes)
    (auth, browse, cache).mapN {
      case (a, b, c) => new LiveEbayClient[F](config, a, b, c)
    }
  }
}
