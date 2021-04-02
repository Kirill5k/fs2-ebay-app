package ebayapp.clients.cex

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.clients.cex.responses._
import ebayapp.common.Cache
import ebayapp.common.config.{CexConfig, SearchQuery}
import ebayapp.common.errors.AppError
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.search._
import ebayapp.common.Logger
import io.circe.generic.auto._
import sttp.client3.circe.asJson
import sttp.client3.{SttpBackend, _}
import sttp.model.{HeaderNames, MediaType, StatusCode, Uri}

import scala.concurrent.duration._

trait CexClient[F[_]] {
  def withUpdatedSellPrice[D <: ItemDetails](item: ResellableItem[D]): F[ResellableItem[D]]
  def findItem[D <: ItemDetails](query: SearchQuery)(implicit
      mapper: CexItemMapper[D]
  ): F[List[ResellableItem[D]]]
}

final class CexApiClient[F[_]](
    private val config: CexConfig,
    private val resellPriceCache: Cache[F, String, Option[SellPrice]],
    private val backend: SttpBackend[F, Any]
)(implicit
    S: Sync[F],
    T: Timer[F],
    logger: Logger[F]
) extends CexClient[F] {

  private val categoriesMap: Map[String, List[Int]] = Map(
    "Games" -> List(1000, 1147, 1003, 1141, 1064, 1146)
  )

  override def withUpdatedSellPrice[D <: ItemDetails](item: ResellableItem[D]): F[ResellableItem[D]] =
    item.itemDetails.fullName match {
      case None =>
        logger.warn(s"""not enough details to query for resell price: "${item.listingDetails.title}"""") *> item.pure[F]
      case Some(name) =>
        val categories = item.listingDetails.category.flatMap(categoriesMap.get)
        findSellPrice(SearchQuery(name), categories).map(sp => item.copy(sellPrice = sp))
    }

  private def findSellPrice(query: SearchQuery, categories: Option[List[Int]]): F[Option[SellPrice]] =
    resellPriceCache.get(query.base64).flatMap {
      case Some(rp) => rp.pure[F]
      case None =>
        val categoryIds = categories.map(_.mkString("[", ",", "]"))
        search(uri"${config.baseUri}/v3/boxes?q=${query.value}&categoryIds=$categoryIds")
          .map(getMinResellPrice)
          .flatTap { rp =>
            if (rp.isEmpty) logger.warn(s"""cex-price-match "${query.value}" returned 0 results""")
            else resellPriceCache.put(query.base64, rp)
          }
    }

  private def getMinResellPrice(searchResponse: CexSearchResponse): Option[SellPrice] =
    searchResponse.response.data
      .map(_.boxes)
      .getOrElse(Nil)
      .filter(_.cannotBuy == 0)
      .minByOption(_.exchangePrice)
      .map(c => SellPrice(BigDecimal(c.cashPrice), BigDecimal(c.exchangePrice)))

  override def findItem[D <: ItemDetails](query: SearchQuery)(implicit
      mapper: CexItemMapper[D]
  ): F[List[ResellableItem[D]]] =
    search(uri"${config.baseUri}/v3/boxes?q=${query.value}&inStock=1&inStockOnline=1")
      .map(_.response.data.fold(List.empty[CexItem])(_.boxes))
      .flatTap(res => logger.info(s"""cex-search "${query.value}" returned ${res.size} results"""))
      .map(_.map(mapper.toDomain))

  private def search(uri: Uri): F[CexSearchResponse] =
    basicRequest
      .get(uri)
      .contentType(MediaType.ApplicationJson)
      .header(HeaderNames.Accept, MediaType.ApplicationJson.toString())
      .response(asJson[CexSearchResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(response) =>
            response.pure[F]
          case Left(DeserializationException(body, error)) =>
            logger.warn(s"error parsing json: ${error.getMessage}\n$body") *>
              AppError.Json(s"error parsing json: ${error.getMessage}").raiseError[F, CexSearchResponse]
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"too many requests to cex. retrying") *> T.sleep(5.seconds) *> search(uri)
          case Left(error) =>
            logger.warn(s"error sending price query to cex: ${r.code}\n$error") *>
              T.sleep(5.second) *> search(uri)
        }
      }
}

object CexClient {


  def make[F[_]: Concurrent: Timer: Logger](
      config: CexConfig,
      backend: SttpBackend[F, Any]
  ): F[CexClient[F]] =
    Cache
      .make[F, String, Option[SellPrice]](config.priceFind.cacheExpiration, config.priceFind.cacheValidationPeriod)
      .map(cache => new CexApiClient[F](config, cache, backend))
}
