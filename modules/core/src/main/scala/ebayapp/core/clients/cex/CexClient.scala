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
import ebayapp.core.clients.{Fs2HttpClient, SearchClient, UserAgentGenerator}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.*
import ebayapp.kernel.errors.AppError
import fs2.Stream
import kirill5k.common.cats.{Cache, Clock}
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.circe.asJson
import sttp.client4.*
import sttp.model.headers.CacheDirective
import sttp.model.{Header, MediaType, StatusCode}

import scala.concurrent.duration.*

trait CexClient[F[_]] extends SearchClient[F]:
  def withUpdatedSellPrice(item: ResellableItem): F[ResellableItem]
  def withUpdatedSellPrices(items: List[ResellableItem]): F[List[ResellableItem]]

final private class CexGraphqlClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val resellPriceCache: Cache[F, String, Option[SellPrice]],
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]]
)(using
    F: Temporal[F],
    logger: Logger[F],
    clock: Clock[F]
) extends CexClient[F] with Fs2HttpClient[F] {

  override protected val name: String = "cex-graphql"

  private def reportItemWithoutName(item: ResellableItem): F[ResellableItem] =
    logger.warn(s"""not enough details to query for resell price: "${item.listingDetails.title}"""").as(item)

  private def obtainPriceFromCache(item: ResellableItem): F[ResellableItem] =
    item.itemDetails.fullName match
      case Some(fullName) => resellPriceCache.get(fullName).map(sp => item.copy(sellPrice = sp.flatten))
      case None           => item.pure[F]

  private def obtainPricesFromCex(items: List[ResellableItem]): F[List[ResellableItem]] =
    val searchRequests = items.flatMap(_.itemDetails.fullName).distinct.map(GraphqlSearchRequest(_, false))
    F.ifM(F.pure(searchRequests.isEmpty))(
      F.pure(items),
      dispatchSearchRequest(searchRequests*)
        .flatMap { res =>
          val resByQuery = res.results.getOrElse(Nil).map(sr => sr.query -> sr.hits).toMap
          items.traverse { item =>
            val query          = item.itemDetails.fullName.get
            val prices         = resByQuery.getOrElse(item.itemDetails.fullName.get, Nil)
            val filteredPrices = filterByCategory(item.foundWith.category)(prices)
            val rp             = getMinResellPrice(filteredPrices)
            F.ifM(F.pure(rp.isEmpty))(
              logPriceMatchMiss(query, item.foundWith.category, prices.size, filteredPrices.size).as(item),
              resellPriceCache.put(query, rp).as(item.copy(sellPrice = rp))
            )
          }
        }
    )

  private def logPriceMatchMiss(query: String, category: Option[String], hitsBeforeFilter: Int, hitsAfterFilter: Int): F[Unit] = {
    val allowedCats = category.flatMap(c => CexClient.categories.get(c))
    val catInfo     = allowedCats.fold("none")(ids => ids.mkString("[", ",", "]"))
    val msg         =
      if hitsBeforeFilter == 0 then s"""$name-price-match "$query" returned 0 hits (allowedCats=$catInfo)"""
      else if hitsAfterFilter == 0 then
        s"""$name-price-match "$query" returned $hitsBeforeFilter hits but 0 after category filter (allowedCats=$catInfo)"""
      else
        s"""$name-price-match "$query" returned $hitsAfterFilter hits after category filter but none with valid exchange price (allowedCats=$catInfo)"""
    logger.warn(msg)
  }

  override def withUpdatedSellPrices(items: List[ResellableItem]): F[List[ResellableItem]] = {
    val (withName, withoutName) = items.partition(_.itemDetails.fullName.isDefined)
    for
      withoutName <- withoutName.traverse(reportItemWithoutName)
      withName    <- withName.traverse(obtainPriceFromCache)
      (withPriceFromCache, withoutPrice) = withName.partition(_.sellPrice.isDefined)
      _ <- logger.info(
        s"getting prices from CEX for ${withoutPrice.size} items; " +
          s"${withoutName.size} items don't have name; " +
          s"${withPriceFromCache.size} prices were obtained from cache"
      )
      withPriceFromCex <- obtainPricesFromCex(withoutPrice)
    yield withoutName ++ withPriceFromCache ++ withPriceFromCex
  }

  override def withUpdatedSellPrice(item: ResellableItem): F[ResellableItem] =
    item.itemDetails.fullName match
      case None       => reportItemWithoutName(item)
      case Some(name) => findSellPrice(name, item.foundWith.category).map(sp => item.copy(sellPrice = sp))

  private def findSellPrice(query: String, category: Option[String]): F[Option[SellPrice]] =
    resellPriceCache.evalPutIfNew(query) {
      dispatchSearchRequest(GraphqlSearchRequest(query, false))
        .flatMap { res =>
          val hits         = res.results.getOrElse(Nil).flatMap(_.hits)
          val filteredHits = filterByCategory(category)(hits)
          val rp           = getMinResellPrice(filteredHits)
          F.whenA(rp.isEmpty)(logPriceMatchMiss(query, category, hits.size, filteredHits.size)).as(rp)
        }
    }

  private def filterByCategory(category: Option[String])(items: List[CexGraphqlItem]): List[CexGraphqlItem] =
    category
      .flatMap(c => CexClient.categories.get(c))
      .fold(items)(catIds => items.filter(i => catIds.contains(i.categoryId)))

  private def getMinResellPrice(items: List[CexGraphqlItem]): Option[SellPrice] =
    items
      .filter(_.exchangePriceCalculated > 0)
      .minByOption(_.exchangePriceCalculated)
      .map(c => SellPrice(c.cashPriceCalculated, c.exchangePriceCalculated))

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(dispatchSearchRequest(GraphqlSearchRequest(criteria.query)))
      .map(_.results.getOrElse(List.empty))
      .flatMap(Stream.emits)
      .map(_.hits)
      .flatMap(Stream.emits)
      .map(CexGraphqlItemMapper.generic.toDomain(criteria))

  private def dispatchSearchRequest(request: GraphqlSearchRequest*): F[CexGraphqlSearchResponse] =
    configProvider()
      .flatMap { config =>
        dispatch {
          basicRequest
            .contentType(MediaType.ApplicationJson)
            .acceptEncoding(acceptAnything)
            .header(Header.userAgent(UserAgentGenerator.random))
            .header(Header.cacheControl(CacheDirective.NoCache, CacheDirective.NoStore))
            .header("Referrer", "https://uk.webuy.com/")
            .header("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
            .header("Accept", "application/json")
            .headers(config.headers)
            .post(uri"${config.uri}/1/indexes/*/queries?${config.queryParameters.getOrElse(Map.empty)}")
            .body(asJson(CexGraphqlSearchRequest(request.toList)))
            .response(asJson[CexGraphqlSearchResponse])
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(response) =>
            response.pure[F]
          case Left(ResponseException.DeserializationException(_, error, _)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-search/exhausted input") *>
              clock.sleep(1.second) *> dispatchSearchRequest(request*)
          case Left(ResponseException.DeserializationException(body, error, _)) =>
            logger.error(s"$name-search/json-error: ${error.getMessage}\n$body") *>
              AppError.Json(s"$name-search/json-error: ${error.getMessage}").raiseError
          case Left(ResponseException.UnexpectedStatusCode(res, meta)) if meta.code == StatusCode.BadRequest =>
            logger.error(s"$name-search/400-bad-request: $res") *> CexGraphqlSearchResponse.empty.pure[F]
          case Left(ResponseException.UnexpectedStatusCode(_, meta)) if meta.code == StatusCode.Forbidden =>
            logger.critical(s"$name-search/403-critical") *> clock.sleep(30.seconds) *> dispatchSearchRequest(request*)
          case Left(ResponseException.UnexpectedStatusCode(_, meta)) if meta.code == StatusCode.TooManyRequests =>
            logger.error(s"$name-search/429-retry") *> clock.sleep(10.seconds) *> dispatchSearchRequest(request*)
          case Left(error) =>
            logger.warn(s"$name-search/${r.code}-error\n$error") *> clock.sleep(5.second) *> dispatchSearchRequest(request*)
        }
      }
}

object CexClient:
  val categories: Map[String, Set[String]] = Map(
    "games-console"           -> Set("1000", "1146", "1147", "1003", "1141", "1064", "1214"),
    "games-ps3"               -> Set("808"),
    "games-xbox-360"          -> Set("782"),
    "games-xbox-one-series-x" -> Set("1000", "1146", "1147"),
    "games-ps4-ps5"           -> Set("1003", "1141"),
    "games-switch"            -> Set("1064", "1214")
  )

  private def mkCache[F[_]: Temporal](configProvider: RetailConfigProvider[F]): F[Cache[F, String, Option[SellPrice]]] =
    for
      config      <- configProvider.cex
      cacheConfig <- Temporal[F].fromOption(config.cache, AppError.Critical("missing cache settings for cex client"))
      cache       <- Cache.make[F, String, Option[SellPrice]](cacheConfig.expiration, cacheConfig.validationPeriod)
    yield cache

  def graphql[F[_]: {Temporal, Logger, Clock}](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  ): F[CexClient[F]] =
    mkCache(configProvider).map(cache => CexGraphqlClient[F](() => configProvider.cex, cache, backend))
