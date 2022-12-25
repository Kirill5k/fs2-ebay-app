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
import ebayapp.core.common.{Cache, ConfigProvider, Logger}
import ebayapp.core.domain.search.*
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import io.circe.syntax.*
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
    logger: Logger[F]
) extends CexClient[F] with HttpClient[F] {

  override protected val name: String = "cex"

  private inline def categoriesMap: Map[String, String] = Map(
    "games-ps3"               -> List(808),
    "games-xbox-360"          -> List(782),
    "games-xbox-one-series-x" -> List(1000, 1146, 1147),
    "games-ps4-ps5"           -> List(1003, 1141),
    "games-switch"            -> List(1064)
  ).map((k, v) => (k, v.mkString("[", ",", "]")))

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
          if (rp.isEmpty && categories.isDefined) findSellPrice(query, None)
          else F.whenA(rp.isEmpty)(logger.warn(s"""cex-price-match "$query" returned 0 results""")) *> rp.pure[F]
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
            .acceptEncoding(gzipDeflateEncoding)
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
              F.sleep(1.second) *> dispatchSearchRequest(fullUri)
          case Left(DeserializationException(body, error)) =>
            logger.error(s"$name-search/json-error: ${error.getMessage}\n$body") *>
              F.raiseError(AppError.Json(s"$name-search/json-error: ${error.getMessage}"))
          case Left(HttpError(_, StatusCode.Forbidden)) =>
            logger.error(s"$name-search/403-critical") *> F.sleep(5.seconds) *> dispatchSearchRequest(fullUri)
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"$name-search/429-retry") *> F.sleep(5.seconds) *> dispatchSearchRequest(fullUri)
          case Left(error) =>
            logger.warn(s"$name-search/${r.code}-error\n$error") *>
              F.sleep(5.second) *> dispatchSearchRequest(fullUri)
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
    logger: Logger[F]
) extends CexClient[F] with HttpClient[F] {

  override protected val name: String = "cex-graphql"

  private val requestParams = Map(
    "x-algolia-agent" -> "Algolia for JavaScript (4.13.1); Browser (lite); instantsearch.js (4.41.1); Vue (2.6.14); Vue InstantSearch (4.3.3); JS Helper (3.8.2)",
    "x-algolia-api-key"        -> "07aa231df2da5ac18bd9b1385546e963",
    "x-algolia-application-id" -> "LNNFEEWZVA"
  )

  override def withUpdatedSellPrice(category: Option[String])(item: ResellableItem): F[ResellableItem] = ???

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(dispatchSearchRequest(criteria.query))
      .map(_.results.getOrElse(List.empty))
      .flatMap(Stream.emits)
      .map(_.hits)
      .flatMap(Stream.emits)
      .map(cexGraphqlGenericItemMapper.toDomain(criteria))

  private def dispatchSearchRequest(query: String): F[CexGraphqlSearchResponse] =
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          emptyRequest
            .contentType(MediaType.ApplicationJson)
            .acceptEncoding(gzipDeflateEncoding)
            .header(Header.cacheControl(CacheDirective.NoCache, CacheDirective.NoStore))
            .header("Referrer", "https://uk.webuy.com/")
            .header("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
            .header("Accept", "application/json")
            .post(uri"${config.baseUri}/1/indexes/*/queries?${config.queryParameters}")
            .body(
              CexGraphqlSearchRequest(
                List(
                  GraphqlSearchRequest(
                    "prod_cex_uk",
                    s"query=${query}&userToken=ecf31216f1ec463fac30a91a1f0a0dc3&facetFilters=%5B%5B%22availability%3AIn%20Stock%20Online%22%2C%22availability%3AIn%20Stock%20In%20Store%22%5D%5D"
                  )
                )
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
              F.sleep(1.second) *> dispatchSearchRequest(query)
          case Left(DeserializationException(body, error)) =>
            logger.error(s"$name-search/json-error: ${error.getMessage}\n$body") *>
              F.raiseError(AppError.Json(s"$name-search/json-error: ${error.getMessage}"))
          case Left(HttpError(_, StatusCode.Forbidden)) =>
            logger.error(s"$name-search/403-critical") *> F.sleep(30.seconds) *> dispatchSearchRequest(query)
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"$name-search/429-retry") *> F.sleep(10.seconds) *> dispatchSearchRequest(query)
          case Left(error) =>
            logger.warn(s"$name-search/${r.code}-error\n$error") *> F.sleep(5.second) *> dispatchSearchRequest(query)
        }
      }
}

object CexClient:
  private def mkCache[F[_]: Temporal](configProvider: ConfigProvider[F]): F[Cache[F, String, Option[SellPrice]]] =
    for
      config      <- configProvider.cex
      cacheConfig <- Temporal[F].fromOption(config.cache, AppError.Critical("missing cache settings for cex client"))
      cache       <- Cache.make[F, String, Option[SellPrice]](cacheConfig.expiration, cacheConfig.validationPeriod)
    yield cache

  def standard[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[CexClient[F]] =
    mkCache(configProvider)
      .map(cache => CexApiClient[F](() => configProvider.cex, cache, backend, proxyBackend))

  def graphql[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[CexClient[F]] =
    mkCache(configProvider)
      .map(cache => CexGraphqlClient[F](() => configProvider.cex, cache, backend, proxyBackend))
