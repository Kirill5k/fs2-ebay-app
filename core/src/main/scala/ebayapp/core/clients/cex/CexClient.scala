package ebayapp.core.clients.cex

import cats.effect.Temporal
import cats.syntax.functor.*
import cats.syntax.applicativeError.*
import cats.syntax.flatMap.*
import cats.syntax.apply.*
import cats.syntax.applicative.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.cex.mappers.cexGenericItemMapper
import ebayapp.core.clients.cex.responses.*
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.kernel.errors.AppError
import ebayapp.core.common.{Cache, ConfigProvider, Logger}
import ebayapp.core.domain.search.*
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import sttp.client3.circe.asJson
import sttp.client3.*
import sttp.model.{StatusCode, Uri}

import scala.concurrent.duration.*

trait CexClient[F[_]] extends SearchClient[F]:
  def withUpdatedSellPrice(category: Option[String])(item: ResellableItem): F[ResellableItem]

final class CexApiClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val resellPriceCache: Cache[F, String, Option[SellPrice]],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    T: Temporal[F],
    logger: Logger[F]
) extends CexClient[F] with HttpClient[F, GenericRetailerConfig] {

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
      search(baseUri => uri"$baseUri/v3/boxes?q=$query&categoryIds=$categories")
        .map(getMinResellPrice)
        .flatMap { rp =>
          if (rp.isEmpty && categories.isDefined) findSellPrice(query, None)
          else if (rp.isEmpty) logger.warn(s"""cex-price-match "$query" returned 0 results""") *> rp.pure[F]
          else rp.pure[F]
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
      .eval(search(baseUri => uri"$baseUri/v3/boxes?q=${criteria.query}&inStock=1&inStockOnline=1"))
      .map(_.response.data.fold(List.empty[CexItem])(_.boxes))
      .flatMap(Stream.emits)
      .map(cexGenericItemMapper.toDomain(criteria))

  private def search(fullUri: String => Uri): F[CexSearchResponse] =
    configProvider()
      .flatMap { config =>
        dispatch {
          basicRequest
            .get(fullUri(config.baseUri))
            .headers(defaultHeaders ++ config.headers)
            .response(asJson[CexSearchResponse])
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(response) =>
            response.pure[F]
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-search/exhausted input") *>
              T.sleep(1.second) *> search(fullUri)
          case Left(DeserializationException(body, error)) =>
            logger.warn(s"$name-search/json-error: ${error.getMessage}\n$body") *>
              AppError.Json(s"$name-search/json-error: ${error.getMessage}").raiseError[F, CexSearchResponse]
          case Left(HttpError(_, StatusCode.Forbidden)) =>
            logger.error(s"$name-search/403-critical") *> T.sleep(5.seconds) *> search(fullUri)
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"$name-search/429-retry") *> T.sleep(5.seconds) *> search(fullUri)
          case Left(error) =>
            logger.warn(s"$name-search/${r.code}-error\n$error") *>
              T.sleep(5.second) *> search(fullUri)
        }
      }
}

object CexClient:
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[CexClient[F]] =
    for
      config      <- configProvider.cex
      cacheConfig <- Temporal[F].fromOption(config.cache, AppError.Critical("missing cache settings for cex client"))
      cache       <- Cache.make[F, String, Option[SellPrice]](cacheConfig.expiration, cacheConfig.validationPeriod)
    yield CexApiClient[F](() => configProvider.cex, cache, backend, proxyBackend)
