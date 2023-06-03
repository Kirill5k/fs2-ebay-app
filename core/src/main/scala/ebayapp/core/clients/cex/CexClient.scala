package ebayapp.core.clients.cex

import cats.effect.Temporal
import cats.syntax.functor.*
import cats.syntax.applicativeError.*
import cats.syntax.flatMap.*
import cats.syntax.apply.*
import cats.syntax.applicative.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.cex.mappers.{cexGenericItemMapper, cexGraphqlGenericItemMapper}
import ebayapp.core.clients.cex.requests.{CexGraphqlSearchRequest, GraphqlSearchRequest}
import ebayapp.core.clients.cex.responses.*
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.kernel.errors.AppError
import ebayapp.kernel.syntax.effects.*
import ebayapp.core.common.{Cache, ConfigProvider, Logger}
import ebayapp.core.domain.search.*
import ebayapp.core.domain.ResellableItem
import ebayapp.kernel.Clock
import fs2.Stream
import sttp.client3.circe.*
import sttp.client3.*
import sttp.model.headers.CacheDirective
import sttp.model.{Header, MediaType, StatusCode, Uri}

import scala.concurrent.duration.*

trait CexClient[F[_]] extends SearchClient[F]:
  def withUpdatedSellPrice(category: Option[String])(item: ResellableItem): F[ResellableItem]

final private class CexApiClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val resellPriceCache: Cache[F, String, Option[SellPrice]],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F],
    clock: Clock[F]
) extends CexClient[F] with HttpClient[F] {

  override protected val name: String = "cex"

  private inline def categoriesMap: Map[String, String] = CexClient.categories.map((k, v) => k -> v.mkString("[", ",", "]"))

  override def withUpdatedSellPrice(category: Option[String])(item: ResellableItem): F[ResellableItem] =
    item.itemDetails.fullName match {
      case None =>
        logger.warn(s"""not enough details to query for resell price: "${item.listingDetails.title}"""") *> item.pure[F]
      case Some(name) =>
        findSellPrice(name, category.flatMap(categoriesMap.get)).map(sp => item.copy(sellPrice = sp))
    }

  private def findSellPrice(query: String, categories: Option[String]): F[Option[SellPrice]] =
    resellPriceCache.evalPutIfNew(query) {
      dispatchSearchRequest(baseUri => uri"$baseUri/v3/boxes?q=$query&categoryIds=$categories")
        .map(getMinResellPrice)
        .flatMap { rp =>
          F.ifTrueOrElse(rp.isEmpty && categories.isDefined)(
            findSellPrice(query, None),
            F.whenA(rp.isEmpty)(logger.warn(s"""cex-price-match "$query" returned 0 results""")) *> rp.pure[F]
          )
        }
    }

  private def getMinResellPrice(searchResponse: CexSearchResponse): Option[SellPrice] =
    searchResponse.response.data
      .map(_.boxes)
      .getOrElse(Nil)
      .filter(_.cannotBuy == 0)
      .minByOption(_.exchangePrice)
      .map(c => SellPrice(BigDecimal(c.cashPrice), BigDecimal(c.exchangePrice)))

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(dispatchSearchRequest(baseUri => uri"$baseUri/v3/boxes?q=${criteria.query}&inStock=1&inStockOnline=1"))
      .map(_.response.data.fold(List.empty[CexItem])(_.boxes))
      .flatMap(Stream.emits)
      .map(cexGenericItemMapper.toDomain(criteria))

  private def dispatchSearchRequest(fullUri: String => Uri): F[CexSearchResponse] =
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          emptyRequest
            .contentType(MediaType.ApplicationXWwwFormUrlencoded)
            .acceptEncoding(acceptAnything)
            .header(Header.cacheControl(CacheDirective.NoCache, CacheDirective.NoStore))
            .header("Referrer", "https://uk.webuy.com/")
            .header("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
            .get(fullUri(config.baseUri))
            .headers(config.headers)
            .response(asJson[CexSearchResponse])
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(response) =>
            response.pure[F]
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-search/exhausted input") *>
              clock.sleep(1.second) *> dispatchSearchRequest(fullUri)
          case Left(DeserializationException(body, error)) =>
            logger.error(s"$name-search/json-error: ${error.getMessage}\n$body") *>
              AppError.Json(s"$name-search/json-error: ${error.getMessage}").raiseError
          case Left(HttpError(_, StatusCode.Forbidden)) =>
            logger.error(s"$name-search/403-critical") *> clock.sleep(5.seconds) *> dispatchSearchRequest(fullUri)
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"$name-search/429-retry") *> clock.sleep(5.seconds) *> dispatchSearchRequest(fullUri)
          case Left(error) =>
            logger.warn(s"$name-search/${r.code}-error\n$error") *>
              clock.sleep(5.second) *> dispatchSearchRequest(fullUri)
        }
      }
}

final private class CexGraphqlClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val resellPriceCache: Cache[F, String, Option[SellPrice]],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F],
    clock: Clock[F]
) extends CexClient[F] with HttpClient[F] {

  override protected val name: String = "cex-graphql"

  override def withUpdatedSellPrice(category: Option[String])(item: ResellableItem): F[ResellableItem] =
    item.itemDetails.fullName match {
      case None =>
        logger.warn(s"""not enough details to query for resell price: "${item.listingDetails.title}"""") *> item.pure[F]
      case Some(name) =>
        findSellPrice(name, category).map(sp => item.copy(sellPrice = sp))
    }

  private def findSellPrice(query: String, category: Option[String]): F[Option[SellPrice]] =
    resellPriceCache.evalPutIfNew(query) {
      dispatchSearchRequest(query, false)
        .map(filterByCategory(category))
        .map(getMinResellPrice)
        .flatMap(rp => F.whenA(rp.isEmpty)(logger.warn(s"""cex-price-match "$query" returned 0 results""")) *> rp.pure[F])
    }

  private def filterByCategory(category: Option[String])(response: CexGraphqlSearchResponse): List[CexGraphqlItem] = {
    val items = response.results.getOrElse(Nil).flatMap(_.hits)
    val cats  = category.flatMap(c => CexClient.categories.get(c))
    if cats.isEmpty then items else items.filter(i => cats.get.contains(i.categoryId))
  }

  private def getMinResellPrice(items: List[CexGraphqlItem]): Option[SellPrice] =
    items
      .filter(_.exchangePriceCalculated > 0)
      .minByOption(_.exchangePriceCalculated)
      .map(c => SellPrice(c.cashPriceCalculated, c.exchangePriceCalculated))

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(dispatchSearchRequest(criteria.query))
      .map(_.results.getOrElse(List.empty))
      .flatMap(Stream.emits)
      .map(_.hits)
      .flatMap(Stream.emits)
      .map(cexGraphqlGenericItemMapper.toDomain(criteria))

  private def dispatchSearchRequest(query: String, inStock: Boolean = true): F[CexGraphqlSearchResponse] = {
    val faceFilters =
      if (inStock) "&facetFilters=%5B%5B%22availability%3AIn%20Stock%20Online%22%2C%22availability%3AIn%20Stock%20In%20Store%22%5D%5D"
      else ""
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          emptyRequest
            .contentType(MediaType.ApplicationJson)
            .acceptEncoding(acceptAnything)
            .header(Header.cacheControl(CacheDirective.NoCache, CacheDirective.NoStore))
            .header("Referrer", "https://uk.webuy.com/")
            .header("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
            .header("Accept", "application/json")
            .post(uri"${config.baseUri}/1/indexes/*/queries?${config.queryParameters.getOrElse(Map.empty)}")
            .body(
              CexGraphqlSearchRequest(
                List(GraphqlSearchRequest("prod_cex_uk", s"query=${query}&userToken=ecf31216f1ec463fac30a91a1f0a0dc3$faceFilters"))
              )
            )
            .headers(config.headers)
            .response(asJson[CexGraphqlSearchResponse])
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(response) =>
            response.pure[F]
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-search/exhausted input") *>
              clock.sleep(1.second) *> dispatchSearchRequest(query)
          case Left(DeserializationException(body, error)) =>
            logger.error(s"$name-search/json-error: ${error.getMessage}\n$body") *>
              AppError.Json(s"$name-search/json-error: ${error.getMessage}").raiseError
          case Left(HttpError(res, StatusCode.BadRequest)) =>
            logger.error(s"$name-search/400-bad-request: $res") *> CexGraphqlSearchResponse.empty.pure[F]
          case Left(HttpError(_, StatusCode.Forbidden)) =>
            logger.error(s"$name-search/403-critical") *> clock.sleep(30.seconds) *> dispatchSearchRequest(query)
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"$name-search/429-retry") *> clock.sleep(10.seconds) *> dispatchSearchRequest(query)
          case Left(error) =>
            logger.warn(s"$name-search/${r.code}-error\n$error") *> clock.sleep(5.second) *> dispatchSearchRequest(query)
        }
      }
  }
}

object CexClient:
  val categories: Map[String, Set[Int]] = Map(
    "games-console"           -> Set(1000, 1146, 1147, 1003, 1141, 1064),
    "games-ps3"               -> Set(808),
    "games-xbox-360"          -> Set(782),
    "games-xbox-one-series-x" -> Set(1000, 1146, 1147),
    "games-ps4-ps5"           -> Set(1003, 1141),
    "games-switch"            -> Set(1064)
  )

  private def mkCache[F[_]: Temporal](configProvider: ConfigProvider[F]): F[Cache[F, String, Option[SellPrice]]] =
    for
      config      <- configProvider.cex
      cacheConfig <- Temporal[F].fromOption(config.cache, AppError.Critical("missing cache settings for cex client"))
      cache       <- Cache.make[F, String, Option[SellPrice]](cacheConfig.expiration, cacheConfig.validationPeriod)
    yield cache

  def standard[F[_]: Temporal: Logger: Clock](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[CexClient[F]] =
    mkCache(configProvider).map(cache => CexApiClient[F](() => configProvider.cex, cache, backend, proxyBackend))

  def graphql[F[_]: Temporal: Logger: Clock](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[CexClient[F]] =
    mkCache(configProvider).map(cache => CexGraphqlClient[F](() => configProvider.cex, cache, backend, proxyBackend))
