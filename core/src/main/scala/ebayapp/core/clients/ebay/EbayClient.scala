package ebayapp.core.clients.ebay

import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.apply.*
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.ebay.auth.EbayAuthClient
import ebayapp.core.clients.ebay.browse.EbayBrowseClient
import ebayapp.core.clients.ebay.browse.responses.{EbayItem, EbayItemSummary}
import ebayapp.core.clients.ebay.mappers.EbayItemMapper
import ebayapp.core.clients.ebay.search.EbaySearchParams
import ebayapp.core.common.config.{EbayConfig, EbaySearchConfig}
import ebayapp.core.common.predicates.*
import ebayapp.kernel.errors.AppError
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.common.Logger
import fs2.Stream
import sttp.client3.SttpBackend

import java.time.Instant

final private[ebay] class LiveEbayClient[F[_]](
    private val config: EbayConfig,
    private val authClient: EbayAuthClient[F],
    private val browseClient: EbayBrowseClient[F]
)(using
    val F: Temporal[F],
    val logger: Logger[F]
) extends SearchClient[F] {

  private def now: F[Instant] = F.realTime.map(_.toMillis).map(Instant.ofEpochMilli)

  def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    for
      time   <- Stream.eval(now.map(_.minusMillis(config.search.maxListingDuration.toMillis)))
      mapper <- Stream.fromEither[F](EbayItemMapper.get(criteria))
      params <- Stream.fromEither[F](EbaySearchParams.get(criteria))
      items <- Stream
        .evalSeq(searchForItems(params.requestArgs(time, criteria.query), params.filter and hasTrustedSeller(config.search)))
        .evalMap(getCompleteItem)
        .unNone
        .map(mapper.toDomain(criteria))
        .handleErrorWith(switchAccountIfItHasExpired)
    yield items

  private def searchForItems(searchParams: Map[String, String], itemsFilter: EbayItemSummary => Boolean): F[List[EbayItemSummary]] =
    for
      token <- authClient.accessToken
      all   <- browseClient.search(token, searchParams)
      valid = all.filter(_.itemGroupType.isEmpty).filter(itemsFilter)
      _ <- logger.info(s"""ebay-search "${searchParams("q")}" returned ${valid.size} new items (total - ${all.size})""")
    yield valid

  private def getCompleteItem(itemSummary: EbayItemSummary): F[Option[EbayItem]] =
    authClient.accessToken.flatMap(t => browseClient.getItem(t, itemSummary.itemId))

  private def hasTrustedSeller(searchConfig: EbaySearchConfig): EbayItemSummary => Boolean = is =>
    (is.seller.feedbackPercentage, is.seller.feedbackScore)
      .mapN { (percentage, score) =>
        percentage > searchConfig.minFeedbackPercentage && score > searchConfig.minFeedbackScore
      }
      .exists(identity)

  private def switchAccountIfItHasExpired: PartialFunction[Throwable, Stream[F, ResellableItem]] = {
    case AppError.Auth(message) =>
      Stream.eval(logger.warn(s"auth error from ebay client ($message). switching account")).drain ++
        Stream.eval(authClient.switchAccount()).drain
    case error: AppError.Critical =>
      Stream.eval(logger.critical(s"critical error while trying to get items from ebay: ${error.message}")).drain ++
        Stream.raiseError[F](error)
    case error =>
      Stream.eval(logger.error(error)(s"unexpected error while getting items from ebay: ${error.getMessage}")).drain
  }
}

object EbayClient:
  def make[F[_]: Temporal: Logger](
      config: EbayConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    (
      EbayAuthClient.make[F](config, backend),
      EbayBrowseClient.make[F](config, backend)
    ).mapN((a, b) => LiveEbayClient[F](config, a, b))
