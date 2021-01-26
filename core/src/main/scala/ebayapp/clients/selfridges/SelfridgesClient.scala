package ebayapp.clients.selfridges

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.selfridges.SelfridgesClient._
import ebayapp.clients.selfridges.mappers._
import ebayapp.common.config.{SearchQuery, SelfridgesConfig}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.ResellableItem
import fs2.Stream
import io.chrisdavenport.log4cats.Logger
import io.circe.generic.auto._
import sttp.client3._
import sttp.client3.circe.asJson
import sttp.model.{HeaderNames, MediaType}

trait SelfridgesClient[F[_]] {
  def search(query: SearchQuery): Stream[F, ResellableItem[Clothing]]
}

final private class LiveSelfridgesClient[F[_]](
    private val config: SelfridgesConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Sync[F],
    L: Logger[F]
) extends SelfridgesClient[F] {

  override def search(query: SearchQuery): Stream[F, ResellableItem[Clothing]] =
    Stream
      .unfoldLoopEval(1)(searchForItems(query))
      .flatMap(Stream.emits)
      .flatMap { item =>
        Stream
          .evalSeq(getItemDetails(item))
          .map { case (stock, price) => (item, stock, price)}
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
      .contentType(MediaType.ApplicationJson)
      .header("api-key", config.apiKey)
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .response(asJson[SelfridgesSearchResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure((res.catalogEntryNavView, res.pageNumber.filter(_ != res.noOfPages).map(_ + 1)))
          case Left(DeserializationException(body, error)) =>
            L.error(s"error parsing selfdridges search response: ${error.getMessage}\n$body") *>
              F.pure((Nil, None))
          case Left(error) =>
            L.error(s"error sending search request to selfridges: ${r.code}\n$error") *>
              F.pure((Nil, None))
        }
      }

  private def getItemPrice(number: String): F[List[ItemPrice]] =
    basicRequest
      .get(uri"${config.baseUri}/api/cms/ecom/v1/GB/en/price/byId/$number")
      .contentType(MediaType.ApplicationJson)
      .header("api-key", config.apiKey)
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .response(asJson[SelfridgesItemPriceResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure(res.prices.getOrElse(Nil))
          case Left(DeserializationException(body, error)) =>
            L.error(s"error parsing selfdridges item price response: ${error.getMessage}\n$body") *>
              F.pure(Nil)
          case Left(error) =>
            L.error(s"error sending item price request to selfridges: ${r.code}\n$error") *>
              F.pure(Nil)
        }
      }

  private def getItemStock(number: String): F[List[ItemStock]] =
    basicRequest
      .get(uri"${config.baseUri}/api/cms/ecom/v1/GB/en/stock/byId/$number")
      .contentType(MediaType.ApplicationJson)
      .header("api-key", config.apiKey)
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .response(asJson[SelfridgesItemStockResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure(res.stocks.getOrElse(Nil))
          case Left(DeserializationException(body, error)) =>
            L.error(s"error parsing selfdridges item stock response: ${error.getMessage}\n$body") *>
              F.pure(Nil)
          case Left(error) =>
            L.error(s"error sending item stock request to selfridges: ${r.code}\n$error") *>
              F.pure(Nil)
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

  def make[F[_]: Sync: Logger](
      config: SelfridgesConfig,
      backend: SttpBackend[F, Any]
  ): F[SelfridgesClient[F]] =
    Sync[F].delay(new LiveSelfridgesClient[F](config, backend))
}
