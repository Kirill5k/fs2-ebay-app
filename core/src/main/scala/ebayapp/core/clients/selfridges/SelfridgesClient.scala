package ebayapp.core.clients.selfridges

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.selfridges.SelfridgesClient._
import ebayapp.core.clients.selfridges.mappers.{selfridgesClothingMapper, SelfridgesItem}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{GenericStoreConfig, SearchCategory, SearchQuery}
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import io.circe.Decoder
import io.circe.generic.auto._
import sttp.client3._
import sttp.client3.circe.asJson
import sttp.model.{StatusCode, Uri}

import scala.concurrent.duration._

final private class LiveSelfridgesClient[F[_]](
    private val config: GenericStoreConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] {

  private val headers = defaultHeaders ++ config.headers

  override def search(
      query: SearchQuery,
      category: Option[SearchCategory]
  ): Stream[F, ResellableItem.Anything] =
    Stream
      .unfoldLoopEval(1)(searchForItems(query))
      .flatMap(Stream.emits)
      .filter(_.price.exists(p => p.lowestWasPrice.isDefined || p.lowestWasWasPrice.isDefined))
      .flatMap { item =>
        Stream
          .evalSeq(getItemDetails(item))
          .metered(1.second)
          .map { case (stock, price) => SelfridgesItem(item, stock, price) }
      }
      .map(selfridgesClothingMapper.toDomain)

  private def getItemDetails(item: CatalogItem): F[List[(ItemStock, Option[ItemPrice])]] =
    (getItemStock(item.partNumber), getItemPrice(item.partNumber))
      .mapN { case (stock, prices) =>
        val pricesBySkuid = prices.groupBy(_.SKUID)
        stock.map(s => (s, pricesBySkuid.get(s.SKUID).flatMap(_.headOption)))
      }

  private def searchForItems(query: SearchQuery)(page: Int): F[(List[CatalogItem], Option[Int])] =
    sendRequest[SelfridgesSearchResponse](
      uri"${config.baseUri}/api/cms/ecom/v1/GB/en/productview/byCategory/byIds?ids=${query.value.replaceAll(" ", "-")}&pageNumber=$page&pageSize=60",
      "products-by-ids",
      SelfridgesSearchResponse(0, None, Nil)
    ).map(res => (res.catalogEntryNavView, res.pageNumber.filter(_ != res.noOfPages).map(_ + 1)))

  private def getItemPrice(number: String): F[List[ItemPrice]] =
    sendRequest[SelfridgesItemPriceResponse](
      uri"${config.baseUri}/api/cms/ecom/v1/GB/en/price/byId/$number",
      "item-price",
      SelfridgesItemPriceResponse(None)
    ).map(res => res.prices.getOrElse(Nil))

  private def getItemStock(number: String): F[List[ItemStock]] =
    sendRequest[SelfridgesItemStockResponse](
      uri"${config.baseUri}/api/cms/ecom/v1/GB/en/stock/byId/$number",
      "item-stock",
      SelfridgesItemStockResponse(None)
    ).map(res => res.stocks.getOrElse(Nil))

  private def sendRequest[A: Decoder](uri: Uri, endpoint: String, defaultResponse: A): F[A] =
    basicRequest
      .get(uri)
      .headers(headers)
      .response(asJson[A])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure(res)
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"selfdridges-$endpoint/exhausted input") *>
              F.sleep(3.second) *> sendRequest(uri, endpoint, defaultResponse)
          case Left(DeserializationException(_, error)) =>
            logger.error(s"selfdridges-$endpoint response parsing error: ${error.getMessage}") *>
              F.pure(defaultResponse)
          case Left(HttpError(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
            logger.error(s"selfridges-$endpoint/$s-critical") *>
              F.sleep(3.second) *> sendRequest(uri, endpoint, defaultResponse)
          case Left(HttpError(_, status)) if status.isClientError =>
            logger.error(s"selfridges-$endpoint/$status-error") *>
              F.pure(defaultResponse)
          case Left(HttpError(_, status)) if status.isServerError =>
            logger.warn(s"selfridges-$endpoint/$status-repeatable") *>
              F.sleep(5.second) *> sendRequest(uri, endpoint, defaultResponse)
          case Left(error) =>
            logger.error(s"selfridges-$endpoint/error: ${error.getMessage}") *>
              F.sleep(5.second) *> sendRequest(uri, endpoint, defaultResponse)
        }
      }
}

object SelfridgesClient {

  final case class ItemPrice(
      SKUID: String,
      `Current Retail Price`: BigDecimal,
      `Was Retail Price`: Option[BigDecimal],
      `Was Was Retail Price`: Option[BigDecimal]
  )

  final case class SelfridgesItemPriceResponse(
      prices: Option[List[ItemPrice]]
  )

  final case class ItemStock(
      SKUID: String,
      value: Option[String],
      `Stock Quantity Available to Purchase`: Int
  )

  final case class SelfridgesItemStockResponse(
      stocks: Option[List[ItemStock]]
  )

  final case class CatalogItemPrice(
      lowestPrice: BigDecimal,
      lowestWasPrice: Option[BigDecimal],
      lowestWasWasPrice: Option[BigDecimal],
      currency: String
  )

  final case class CatalogItem(
      partNumber: String,
      seoKey: String,
      imageName: String,
      name: String,
      brandName: String,
      price: List[CatalogItemPrice]
  )

  final case class SelfridgesSearchResponse(
      noOfPages: Int,
      pageNumber: Option[Int],
      catalogEntryNavView: List[CatalogItem]
  )

  def make[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveSelfridgesClient[F](config, backend))
}
