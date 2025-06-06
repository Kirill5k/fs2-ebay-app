package ebayapp.core.clients.selfridges

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.apply.*
import ebayapp.core.clients.{Fs2HttpClient, SearchClient, UserAgentGenerator}
import ebayapp.core.clients.selfridges.mappers.{SelfridgesItem, SelfridgesItemMapper}
import ebayapp.core.clients.selfridges.responses.*
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import io.circe.Decoder
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.*
import sttp.client4.circe.asJson
import sttp.model.headers.CacheDirective
import sttp.model.{Header, MediaType, StatusCode, Uri}

import scala.concurrent.duration.*

final private class LiveSelfridgesClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with Fs2HttpClient[F] {

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
          .filter(!_.fullName.matches(filters))
          .filter(_.isOnSale)
          .flatMap { item =>
            Stream
              .evalSeq(getItemDetails(item))
              .metered(config.delayBetweenIndividualRequests.getOrElse(Duration.Zero))
              .map((stock, price) => SelfridgesItem(item, stock, price))
          }
          .map(SelfridgesItemMapper.clothing.toDomain(criteria))
          .filter(_.buyPrice.quantityAvailable > 0)
      }

  private def getItemDetails(item: CatalogItem): F[List[(List[ItemStock], Option[ItemPrice])]] =
    (getItemStock(item.partNumber), getItemPrice(item.partNumber))
      .mapN { (stock, prices) =>
        val stockBySkuid  = stock.groupBy(_.SKUID).toList
        val pricesBySkuid = prices.groupBy(_.SKUID)

        stockBySkuid
          .map { (skuid, stockItems) =>
            stockItems -> pricesBySkuid.get(skuid).flatMap(_.headOption)
          }
      }

  private def searchForItems(criteria: SearchCriteria)(page: Int): F[(List[CatalogItem], Option[Int])] =
    sendRequest[SelfridgesSearchResponse](
      { baseUri =>
        val q = criteria.query.replaceAll(" ", "-")
        val c = criteria.category.fold("")(c => s"|$c")
        uri"$baseUri/api/cms/ecom/v1/GB/en/productview/byCategory/byIds?ids=${q + c}&pageNumber=$page&pageSize=60"
      },
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
        dispatch {
          basicRequest
            .contentType(MediaType.ApplicationJson)
            .acceptEncoding(acceptAnything)
            .header(Header.userAgent(UserAgentGenerator.random))
            .header(Header.cacheControl(CacheDirective.NoCache))
            .headers(config.headers)
            .get(fullUri(config.uri))
            .response(asJson[A])
        }
      }
      .flatMap { r =>
        r.body match
          case Right(res) =>
            F.pure(res)
          case Left(ResponseException.DeserializationException(_, error, _)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-$endpoint/exhausted input") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(ResponseException.DeserializationException(_, error, _)) =>
            logger.error(s"$name-$endpoint response parsing error: ${error.getMessage}") *>
              F.pure(defaultResponse)
          case Left(ResponseException.UnexpectedStatusCode(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
            logger.error(s"$name-$endpoint/$s-critical") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(ResponseException.UnexpectedStatusCode(_, metadata)) if metadata.code.isClientError =>
            logger.error(s"$name-$endpoint/${metadata.code}-error") *>
              F.pure(defaultResponse)
          case Left(ResponseException.UnexpectedStatusCode(_, metadata)) if metadata.code.isServerError =>
            logger.warn(s"$name-$endpoint/${metadata.code}-repeatable") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(error) =>
            logger.error(s"$name-$endpoint/error: ${error.getMessage}") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
      }
}

object SelfridgesClient:
  def make[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveSelfridgesClient[F](() => configProvider.selfridges, backend))
