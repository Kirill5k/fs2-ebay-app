package ebayapp.clients.selfridges

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.selfridges.SelfridgesClient.{CatalogItem, ItemStock, SelfridgesItemStockResponse, SelfridgesSearchResponse}
import ebayapp.clients.selfridges.mappers._
import ebayapp.common.config.{SearchQuery, SelfridgesConfig}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.ResellableItem
import fs2.Stream
import io.chrisdavenport.log4cats.Logger
import io.circe.generic.auto._
import sttp.client._
import sttp.client.circe.asJson
import sttp.model.{HeaderNames, MediaType}

trait SelfridgesClient[F[_]] {
  def search(query: SearchQuery): Stream[F, ResellableItem[Clothing]]
}

final private class LiveSelfridgesClient[F[_]](
    private val config: SelfridgesConfig
)(implicit
    val B: SttpBackend[F, Nothing, NothingT],
    F: Sync[F],
    L: Logger[F]
) extends SelfridgesClient[F] {

  override def search(query: SearchQuery): Stream[F, ResellableItem[Clothing]] =
    Stream
      .unfoldLoopEval(1)(searchForItems(query))
      .flatMap(Stream.emits)
      .flatMap(item => Stream.evalSeq(getItemStock(item.partNumber)).map(stock => (item, stock)))
      .map { case (item, stock) => clothingMapper.toDomain(item, stock) }

  private def searchForItems(query: SearchQuery)(page: Int): F[(List[CatalogItem], Option[Int])] =
    basicRequest
      .get(uri"${config.baseUri}/api/cms/ecom/v1/GB/en/search/${query.value}?pageSize=60&pageNumber=$page")
      .contentType(MediaType.ApplicationJson)
      .header("api-key", config.apiKey)
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .response(asJson[SelfridgesSearchResponse])
      .send()
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure((res.catalogEntryNavView, if (res.noOfPages == res.pageNumber) None else Some(page + 1)))
          case Left(DeserializationError(body, error)) =>
            L.error(s"error parsing selfdridges search response: ${error.getMessage}\n$body") *>
              F.pure((Nil, None))
          case Left(error) =>
            L.error(s"error sending search request to selfridges: ${r.code}\n$error") *>
              F.pure((Nil, None))
        }
      }

  private def getItemStock(number: String): F[List[ItemStock]] =
    basicRequest
      .get(uri"${config.baseUri}/api/cms/ecom/v1/GB/en/stock/byId/$number")
      .contentType(MediaType.ApplicationJson)
      .header("api-key", config.apiKey)
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .response(asJson[SelfridgesItemStockResponse])
      .send()
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure(res.stocks)
          case Left(DeserializationError(body, error)) =>
            L.error(s"error parsing selfdridges item stock response: ${error.getMessage}\n$body") *>
              F.pure(Nil)
          case Left(error) =>
            L.error(s"error sending item stock request to selfridges: ${r.code}\n$error") *>
              F.pure(Nil)
        }
      }
}

object SelfridgesClient {

  final case class ItemStock(
      value: String,
      `Stock Quantity Available to Purchase`: Int
  )

  final case class SelfridgesItemStockResponse(
      stocks: List[ItemStock]
  )

  final case class ItemPrice(
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
      price: List[ItemPrice]
  )

  final case class SelfridgesSearchResponse(
      noOfPages: Int,
      pageNumber: Int,
      catalogEntryNavView: List[CatalogItem]
  )

  def make[F[_]: Sync: Logger](
      config: SelfridgesConfig,
      backend: SttpBackend[F, Nothing, NothingT]
  ): F[SelfridgesClient[F]] =
    Sync[F].delay(new LiveSelfridgesClient[F](config)(backend, Sync[F], Logger[F]))
}
