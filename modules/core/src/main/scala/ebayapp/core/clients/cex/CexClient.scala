package ebayapp.core.clients.cex

import cats.effect.Temporal
import cats.syntax.applicative.*
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.traverse.*
import ebayapp.core.clients.cex.mappers.CexGraphqlItemMapper
import ebayapp.core.clients.cex.requests.{CexGraphqlSearchRequest, GraphqlSearchRequest}
import ebayapp.core.clients.cex.responses.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.*
import ebayapp.kernel.errors.AppError
import fs2.Stream
import kirill5k.common.cats.{Cache, Clock}
import sttp.client3.*
import sttp.client3.circe.*
import sttp.model.headers.CacheDirective
import sttp.model.{Header, MediaType, StatusCode}

import scala.concurrent.duration.*

trait CexClient[F[_]] extends SearchClient[F]:
  def withUpdatedSellPrice(item: ResellableItem): F[ResellableItem]
  def withUpdatedSellPrices(items: List[ResellableItem]): F[List[ResellableItem]]

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

  private def reportItemWithoutName(item: ResellableItem): F[ResellableItem] =
    logger.warn(s"""not enough details to query for resell price: "${item.listingDetails.title}"""").as(item)

  private def obtainPriceFromCache(item: ResellableItem): F[ResellableItem] =
    item.itemDetails.fullName match
      case Some(fullName) => resellPriceCache.get(fullName).map(sp => item.copy(sellPrice = sp.flatten))
      case None           => item.pure[F]

  private def obtainPricesFromCex(items: List[ResellableItem]): F[List[ResellableItem]] = {
    val searchRequests = items.flatMap(_.itemDetails.fullName).distinct.map(searchRequest(_, false))
    if (searchRequests.isEmpty) F.pure(items)
    else {
      dispatch(searchRequests*)
        .flatMap { res =>
          val resByQuery = res.results.getOrElse(Nil).map(sr => sr.query -> sr.hits).toMap
          items.traverse { item =>
            val query          = item.itemDetails.fullName.get
            val prices         = resByQuery.getOrElse(item.itemDetails.fullName.get, Nil)
            val filteredPrices = filterByCategory(item.foundWith.category)(prices)
            val rp             = getMinResellPrice(filteredPrices)
            F.ifM(F.pure(rp.isEmpty))(
              logger.warn(s"""cex-price-match "$query" returned 0 results""").as(item),
              resellPriceCache.put(query, rp).as(item.copy(sellPrice = rp))
            )
          }
        }
    }
  }

  override def withUpdatedSellPrices(items: List[ResellableItem]): F[List[ResellableItem]] = {
    val (withName, withoutName) = items.partition(_.itemDetails.fullName.isDefined)
    for
      withoutName <- withoutName.traverse(reportItemWithoutName)
      withName    <- withName.traverse(obtainPriceFromCache)
      (withPriceFromCache, withoutPrice) = withName.partition(_.sellPrice.isDefined)
      _ <- logger.info(s"getting prices for ${withoutPrice.size} items; ${withoutName.size} don't have name; ${withPriceFromCache.size} prices were obtained from cache")
      withPriceFromCex <- obtainPricesFromCex(withoutPrice)
    yield withoutName ++ withPriceFromCache ++ withPriceFromCex
  }

  override def withUpdatedSellPrice(item: ResellableItem): F[ResellableItem] =
    item.itemDetails.fullName match {
      case None =>
        reportItemWithoutName(item)
      case Some(name) =>
        findSellPrice(name, item.foundWith.category).map(sp => item.copy(sellPrice = sp))
    }

  private def findSellPrice(query: String, category: Option[String]): F[Option[SellPrice]] =
    resellPriceCache.evalPutIfNew(query) {
      dispatch(searchRequest(query, false))
        .map(_.results.getOrElse(Nil).flatMap(_.hits))
        .map(filterByCategory(category))
        .map(getMinResellPrice)
        .flatMap(rp => F.whenA(rp.isEmpty)(logger.warn(s"""cex-price-match "$query" returned 0 results""")) *> rp.pure[F])
    }

  private def filterByCategory(category: Option[String])(items: List[CexGraphqlItem]): List[CexGraphqlItem] = {
    val cats = category.flatMap(c => CexClient.categories.get(c))
    if cats.isEmpty then items else items.filter(i => cats.get.contains(i.categoryId))
  }

  private def getMinResellPrice(items: List[CexGraphqlItem]): Option[SellPrice] =
    items
      .filter(_.exchangePriceCalculated > 0)
      .minByOption(_.exchangePriceCalculated)
      .map(c => SellPrice(c.cashPriceCalculated, c.exchangePriceCalculated))

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(dispatch(searchRequest(criteria.query)))
      .map(_.results.getOrElse(List.empty))
      .flatMap(Stream.emits)
      .map(_.hits)
      .flatMap(Stream.emits)
      .map(CexGraphqlItemMapper.generic.toDomain(criteria))

  private def searchRequest(query: String, inStock: Boolean = true): GraphqlSearchRequest = {
    val faceFilters =
      if (inStock) "&facetFilters=%5B%5B%22availability%3AIn%20Stock%20Online%22%2C%22availability%3AIn%20Stock%20In%20Store%22%5D%5D"
      else ""
    GraphqlSearchRequest("prod_cex_uk", s"query=${query}&userToken=ecf31216f1ec463fac30a91a1f0a0dc3$faceFilters")
  }

  private def dispatch(request: GraphqlSearchRequest*): F[CexGraphqlSearchResponse] =
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
              CexGraphqlSearchRequest(request.toList)
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
              clock.sleep(1.second) *> dispatch(request*)
          case Left(DeserializationException(body, error)) =>
            logger.error(s"$name-search/json-error: ${error.getMessage}\n$body") *>
              AppError.Json(s"$name-search/json-error: ${error.getMessage}").raiseError
          case Left(HttpError(res, StatusCode.BadRequest)) =>
            logger.error(s"$name-search/400-bad-request: $res") *> CexGraphqlSearchResponse.empty.pure[F]
          case Left(HttpError(_, StatusCode.Forbidden)) =>
            logger.error(s"$name-search/403-critical") *> clock.sleep(30.seconds) *> dispatch(request*)
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"$name-search/429-retry") *> clock.sleep(10.seconds) *> dispatch(request*)
          case Left(error) =>
            logger.warn(s"$name-search/${r.code}-error\n$error") *> clock.sleep(5.second) *> dispatch(request*)
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

  private def mkCache[F[_]: Temporal](configProvider: RetailConfigProvider[F]): F[Cache[F, String, Option[SellPrice]]] =
    for
      config      <- configProvider.cex
      cacheConfig <- Temporal[F].fromOption(config.cache, AppError.Critical("missing cache settings for cex client"))
      cache       <- Cache.make[F, String, Option[SellPrice]](cacheConfig.expiration, cacheConfig.validationPeriod)
    yield cache

  def graphql[F[_]: Temporal: Logger: Clock](
      configProvider: RetailConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[CexClient[F]] =
    mkCache(configProvider).map(cache => CexGraphqlClient[F](() => configProvider.cex, cache, backend, proxyBackend))
