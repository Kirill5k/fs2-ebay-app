package ebayapp.clients.selfridges

import cats.effect.{Sync, Timer}
import cats.implicits._
import ebayapp.clients.selfridges.SelfridgesClient._
import ebayapp.clients.selfridges.mappers._
import ebayapp.common.config.{SearchQuery, SelfridgesConfig}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.ResellableItem
import fs2.Stream
import ebayapp.common.Logger
import io.circe.Error
import io.circe.generic.auto._
import sttp.client3._
import sttp.client3.circe.asJson

import scala.concurrent.duration._

trait SelfridgesClient[F[_]] {
  def search(query: SearchQuery): Stream[F, ResellableItem[Clothing]]
}

final private class LiveSelfridgesClient[F[_]](
    private val config: SelfridgesConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
  F: Sync[F],
  L: Logger[F],
  T: Timer[F]
) extends SelfridgesClient[F] {

  private val defaultHeaders = Map(
    "cache-control"    -> "no-cache",
    "content-type"     -> "application/json; charset=utf-8",
    "accept"           -> "application/json, text/javascript, */*; q=0.01",
    "accept-language"  -> "en-GB,en-US;q=0.9,en;q=0.8",
    "user-agent"       -> "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 OPR/73.0.3856.344",
    "x-requested-with" -> "XMLHttpRequest",
    "referer"          -> "https://www.selfridges.com/",
    "sec-fetch-dest"   -> "empty",
    "sec-fetch-mode"   -> "cors",
    "sec-fetch-site"   -> "same-origin"
  )

  override def search(query: SearchQuery): Stream[F, ResellableItem[Clothing]] =
    Stream
      .unfoldLoopEval(1)(searchForItems(query))
      .flatMap(Stream.emits)
      .flatMap { item =>
        Stream
          .evalSeq(getItemDetails(item))
          .metered(100.millis)
          .map { case (stock, price) => (item, stock, price) }
      }
      .map { case (item, stock, price) => clothingMapper.toDomain(item, stock, price) }

  private def getItemDetails(item: CatalogItem): F[List[(ItemStock, Option[ItemPrice])]] =
    (getItemStock(item.partNumber), getItemPrice(item.partNumber))
      .mapN { case (stock, prices) =>
        val pricesBySkuid = prices.groupBy(_.SKUID)
        stock.map(s => (s, pricesBySkuid.get(s.SKUID).flatMap(_.headOption)))
      }

  private def searchForItems(query: SearchQuery)(page: Int): F[(List[CatalogItem], Option[Int])] =
    basicRequest
      .get(
        uri"${config.baseUri}/api/cms/ecom/v1/GB/en/productview/byCategory/byIds?ids=${query.value.replaceAll(" ", "-")}&pageNumber=$page&pageSize=60"
      )
      .headers(defaultHeaders)
      .header("api-key", config.apiKey)
      .response(asJson[SelfridgesSearchResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure((res.catalogEntryNavView, res.pageNumber.filter(_ != res.noOfPages).map(_ + 1)))
          case Left(error) =>
            handleError[(List[CatalogItem], Option[Int])]("products by ids", (Nil, None))(error)
        }
      }

  private def getItemPrice(number: String): F[List[ItemPrice]] =
    basicRequest
      .get(uri"${config.baseUri}/api/cms/ecom/v1/GB/en/price/byId/$number")
      .headers(defaultHeaders)
      .header("api-key", config.apiKey)
      .response(asJson[SelfridgesItemPriceResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(res) => F.pure(res.prices.getOrElse(Nil))
          case Left(error) => handleError[List[ItemPrice]]("item price", Nil)(error)
        }
      }

  private def getItemStock(number: String): F[List[ItemStock]] =
    basicRequest
      .get(uri"${config.baseUri}/api/cms/ecom/v1/GB/en/stock/byId/$number")
      .headers(defaultHeaders)
      .header("api-key", config.apiKey)
      .response(asJson[SelfridgesItemStockResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(res) => F.pure(res.stocks.getOrElse(Nil))
          case Left(error) => handleError[List[ItemStock]]("item stock", Nil)(error)
        }
      }

  private def handleError[A](endpoint: String, defaultResult: A)(error: ResponseException[String, Error]): F[A] =
    error match {
      case DeserializationException(_, error) =>
        L.critical(s"error parsing selfdridges $endpoint response: ${error.getMessage}") *>
          F.pure(defaultResult)
      case HttpError(_, status) if status.isClientError =>
        L.critical(s"error sending $endpoint request to selfridges: ${status}") *>
          F.pure(defaultResult)
      case error =>
        L.error(s"error sending $endpoint request to selfridges: ${error.getMessage}") *>
          F.pure(defaultResult)
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

  def make[F[_]: Sync: Logger: Timer](
      config: SelfridgesConfig,
      backend: SttpBackend[F, Any]
  ): F[SelfridgesClient[F]] =
    Sync[F].delay(new LiveSelfridgesClient[F](config, backend))
}
