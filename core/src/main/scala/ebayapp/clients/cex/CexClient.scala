package ebayapp.clients.cex

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient.{CexSearchResponse, SearchResult}
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.Cache
import ebayapp.common.config.{CexConfig, SearchQuery}
import ebayapp.common.errors.AppError
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.search._
import io.chrisdavenport.log4cats.Logger
import io.circe.generic.auto._
import sttp.client.circe.asJson
import sttp.client.{NothingT, SttpBackend, _}
import sttp.model.{HeaderNames, MediaType, StatusCode, Uri}

import scala.concurrent.duration._

trait CexClient[F[_]] {
  def withUpdatedSellPrice[D <: ItemDetails](item: ResellableItem[D]): F[ResellableItem[D]]
  def findItem[D <: ItemDetails](query: SearchQuery)(
    implicit mapper: CexItemMapper[D]
  ): F[List[ResellableItem[D]]]
}

final class CexApiClient[F[_]](
    private val config: CexConfig,
    private val resellPriceCache: Cache[F, String, Option[SellPrice]]
)(
    implicit val B: SttpBackend[F, Nothing, NothingT],
    S: Sync[F],
    T: Timer[F],
    L: Logger[F]
) extends CexClient[F] {

  override def withUpdatedSellPrice[D <: ItemDetails](item: ResellableItem[D]): F[ResellableItem[D]] =
    item.itemDetails.fullName match {
      case None =>
        L.warn(s"""not enough details to query for resell price: "${item.listingDetails.title}"""") *> item.pure[F]
      case Some(name) =>
        findSellPrice(SearchQuery(name)).map(sp => item.copy(sellPrice = sp))
    }

  private def findSellPrice(query: SearchQuery): F[Option[SellPrice]] =
    resellPriceCache.get(query.base64).flatMap {
      case Some(rp) => rp.pure[F]
      case None =>
        search(uri"${config.baseUri}/v3/boxes?q=${query.value}")
          .map(getMinResellPrice)
          .flatTap { rp =>
            if (rp.isEmpty) L.warn(s"""cex-price-match "${query.value}" returned 0 results""")
            else resellPriceCache.put(query.base64, rp)
          }
    }

  private def getMinResellPrice(searchResponse: CexSearchResponse): Option[SellPrice] =
    for {
      data     <- searchResponse.response.data
      cheapest <- data.boxes.minByOption(_.exchangePrice)
    } yield SellPrice(BigDecimal(cheapest.cashPrice), BigDecimal(cheapest.exchangePrice))

  override def findItem[D <: ItemDetails](query: SearchQuery)(
      implicit mapper: CexItemMapper[D]
  ): F[List[ResellableItem[D]]] =
    search(uri"${config.baseUri}/v3/boxes?q=${query.value}&inStock=1&inStockOnline=1")
      .map(_.response.data.fold(List.empty[SearchResult])(_.boxes))
      .flatTap(res => L.info(s"""cex-search "${query.value}" returned ${res.size} results"""))
      .map(_.map(mapper.toDomain))

  private def search(uri: Uri): F[CexSearchResponse] =
    basicRequest
      .get(uri)
      .contentType(MediaType.ApplicationJson)
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .response(asJson[CexSearchResponse])
      .send()
      .flatMap { r =>
        r.code match {
          case s if s.isSuccess =>
            val searchResponse = r.body.left.map {
              case DeserializationError(_, e) => AppError.Json(s"error parsing json: $e")
              case e                          => AppError.Json(s"error parsing json: ${e.getMessage}")
            }
            S.fromEither(searchResponse)
          case StatusCode.TooManyRequests =>
            L.warn(s"too many requests to cex. retrying") *> T.sleep(3.second) *> search(uri)
          case s =>
            L.error(s"error sending price query to cex: $s\n${r.body.fold(_.getMessage, _.toString)}") *>
              T.sleep(1.second) *> search(uri)
        }
      }
}

object CexClient {
  final case class SearchResult(
      boxId: String,
      boxName: String,
      categoryName: String,
      sellPrice: Double,
      exchangePrice: Double,
      cashPrice: Double,
      ecomQuantityOnHand: Int
  )

  final case class SearchResults(
      boxes: List[SearchResult],
      totalRecords: Int,
      minPrice: Double,
      maxPrice: Double
  )

  final case class SearchResponse(data: Option[SearchResults])

  final case class CexSearchResponse(response: SearchResponse)

  def make[F[_]: Concurrent: Timer: Logger](
      config: CexConfig,
      backend: SttpBackend[F, Nothing, NothingT]
  ): F[CexClient[F]] =
    Cache
      .make[F, String, Option[SellPrice]](config.priceFind.cacheExpiration, config.priceFind.cacheValidationPeriod)
      .map { cache =>
        new CexApiClient[F](config, cache)(backend, Sync[F], Timer[F], Logger[F])
      }
}
