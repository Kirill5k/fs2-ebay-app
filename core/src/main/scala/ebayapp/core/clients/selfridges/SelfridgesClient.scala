package ebayapp.core.clients.selfridges

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.apply.*
import cats.syntax.semigroup.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.selfridges.mappers.{selfridgesClothingMapper, SelfridgesItem}
import ebayapp.core.clients.selfridges.responses.*
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import io.circe.Decoder
import sttp.client3.*
import sttp.client3.circe.asJson
import sttp.model.headers.CacheDirective
import sttp.model.{Header, MediaType, StatusCode, Uri}

import scala.concurrent.duration.*

final private class LiveSelfridgesClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "selfridges"

  private val filters: String = List(
    "\\d+-\\d+ (year|month)",
    "thong",
    "\\bBRA\\b",
    "bikini",
    "jersey (brief|shirt|t-shirt|top)",
    "swimsuit",
    "jock( )?strap",
    "bralette",
    "briefs",
    "woman",
    "leggings",
    "\\bdress\\b",
    "skirt",
    "blouse"
  ).mkString("(?i).*(", "|", ").*")

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(configProvider())
      .flatMap { config =>
        Stream
          .unfoldLoopEval(1)(searchForItems(criteria))
          .metered(config.delayBetweenIndividualRequests.getOrElse(Duration.Zero))
          .flatMap(Stream.emits)
          .filter(!_.name.matches(filters))
          .filter(_.isOnSale)
          .flatMap { item =>
            Stream
              .evalSeq(getItemDetails(item))
              .metered(config.delayBetweenIndividualRequests.getOrElse(Duration.Zero))
              .map((stock, price) => SelfridgesItem(item, stock, price))
          }
          .map(selfridgesClothingMapper.toDomain(criteria))
          .filter(_.buyPrice.quantityAvailable > 0)
      }

  private def getItemDetails(item: CatalogItem): F[List[(ItemStock, Option[ItemPrice])]] =
    (getItemStock(item.partNumber), getItemPrice(item.partNumber))
      .mapN { (stock, prices) =>
        val mergedStock   = stock.groupBy(_.SKUID).values.map(s => s.sortBy(_.key).reduce(_ |+| _)).toList
        val pricesBySkuid = prices.groupBy(_.SKUID)
        mergedStock.map(s => (s, pricesBySkuid.get(s.SKUID).flatMap(_.headOption)))
      }

  private def searchForItems(criteria: SearchCriteria)(page: Int): F[(List[CatalogItem], Option[Int])] =
    sendRequest[SelfridgesSearchResponse](
      baseUri =>
        uri"$baseUri/api/cms/ecom/v1/GB/en/productview/byCategory/byIds?ids=${criteria.query.replaceAll(" ", "-")}&pageNumber=$page&pageSize=60",
      "products-by-ids",
      SelfridgesSearchResponse(0, None, Nil)
    ).map(res => (res.catalogEntryNavView, res.pageNumber.filter(_ != res.noOfPages).map(_ + 1)))

  private def getItemPrice(number: String): F[List[ItemPrice]] =
    sendRequest[SelfridgesItemPriceResponse](
      baseUri => uri"$baseUri/api/cms/ecom/v1/GB/en/price/byId/$number",
      "item-price",
      SelfridgesItemPriceResponse(None)
    ).map(res => res.prices.getOrElse(Nil))

  private def getItemStock(number: String): F[List[ItemStock]] =
    sendRequest[SelfridgesItemStockResponse](
      baseUri => uri"$baseUri/api/cms/ecom/v1/GB/en/stock/byId/$number",
      "item-stock",
      SelfridgesItemStockResponse(None)
    ).map(res => res.stocks.getOrElse(Nil))

  private def sendRequest[A: Decoder](fullUri: String => Uri, endpoint: String, defaultResponse: A): F[A] =
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          emptyRequest
            .contentType(MediaType.ApplicationJson)
            .acceptEncoding(gzipDeflateEncoding)
            .header(Header.userAgent(postmanUserAgent))
            .header(Header.cacheControl(CacheDirective.NoCache))
            .get(fullUri(config.baseUri))
            .headers(config.headers)
            .response(asJson[A])
        }
      }
      .flatMap { r =>
        r.body match
          case Right(res) =>
            F.pure(res)
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-$endpoint/exhausted input") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(DeserializationException(_, error)) =>
            logger.error(s"$name-$endpoint response parsing error: ${error.getMessage}") *>
              F.pure(defaultResponse)
          case Left(HttpError(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
            logger.error(s"$name-$endpoint/$s-critical") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(HttpError(_, status)) if status.isClientError =>
            logger.error(s"$name-$endpoint/$status-error") *>
              F.pure(defaultResponse)
          case Left(HttpError(_, status)) if status.isServerError =>
            logger.warn(s"$name-$endpoint/$status-repeatable") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(error) =>
            logger.error(s"$name-$endpoint/error: ${error.getMessage}") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
      }
}

object SelfridgesClient:
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveSelfridgesClient[F](() => configProvider.selfridges, backend, proxyBackend))
