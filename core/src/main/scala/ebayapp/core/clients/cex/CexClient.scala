package ebayapp.core.clients.cex

import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.cex.mappers.cexGenericItemMapper
import ebayapp.core.clients.cex.responses._
import ebayapp.core.common.{Cache, Logger}
import ebayapp.core.common.config.{CexConfig, SearchCategory, SearchQuery}
import ebayapp.core.common.errors.AppError
import ebayapp.core.domain.search._
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import io.circe.generic.auto._
import sttp.client3.circe.asJson
import sttp.client3.{SttpBackend, _}
import sttp.model.{HeaderNames, MediaType, StatusCode, Uri}
import fs2.Stream

import scala.concurrent.duration._

trait CexClient[F[_]] extends SearchClient[F] {
  def withUpdatedSellPrice[D <: ItemDetails](item: ResellableItem[D]): F[ResellableItem[D]]
}

final class CexApiClient[F[_]](
    private val config: CexConfig,
    private val resellPriceCache: Cache[F, String, Option[SellPrice]],
    private val backend: SttpBackend[F, Any]
)(implicit
    T: Temporal[F],
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
    resellPriceCache.evalPutIfNew(query.base64) {
      val categoryIds = categories.map(_.mkString("[", ",", "]"))
      search(uri"${config.baseUri}/v3/boxes?q=${query.value}&categoryIds=$categoryIds")
        .map(getMinResellPrice)
        .flatTap { rp =>
          if (rp.isEmpty) logger.warn(s"""cex-price-match "${query.value}" returned 0 results""")
          else ().pure[F]
        }
    }

  private def getMinResellPrice(searchResponse: CexSearchResponse): Option[SellPrice] =
    searchResponse.response.data
      .map(_.boxes)
      .getOrElse(Nil)
      .filter(_.cannotBuy == 0)
      .minByOption(_.exchangePrice)
      .map(c => SellPrice(BigDecimal(c.cashPrice), BigDecimal(c.exchangePrice)))

  override def search(
      query: SearchQuery,
      category: Option[SearchCategory]
  ): Stream[F, ResellableItem.Anything] =
    Stream
      .eval(search(uri"${config.baseUri}/v3/boxes?q=${query.value}&inStock=1&inStockOnline=1"))
      .map(_.response.data.fold(List.empty[CexItem])(_.boxes))
      .flatMap(Stream.emits)
      .map(cexGenericItemMapper.toDomain)

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
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"cex-search/exhausted input") *>
              T.sleep(1.second) *> search(uri)
          case Left(DeserializationException(body, error)) =>
            logger.warn(s"cex-search/json-error: ${error.getMessage}\n$body") *>
              AppError.Json(s"cex-search/json-error: ${error.getMessage}").raiseError[F, CexSearchResponse]
          case Left(HttpError(_, StatusCode.Forbidden)) =>
            logger.error(s"cex-search/403-critical") *> T.sleep(5.seconds) *> search(uri)
          case Left(HttpError(_, StatusCode.TooManyRequests)) =>
            logger.warn(s"cex-search/429-retry") *> T.sleep(5.seconds) *> search(uri)
          case Left(error) =>
            logger.warn(s"cex-search/${r.code}-error\n$error") *>
              T.sleep(5.second) *> search(uri)
        }
      }
}

object CexClient {

  def make[F[_]: Temporal: Logger](
      config: CexConfig,
      backend: SttpBackend[F, Any]
  ): F[CexClient[F]] =
    Cache
      .make[F, String, Option[SellPrice]](config.priceFind.cacheExpiration, config.priceFind.cacheValidationPeriod)
      .map(cache => new CexApiClient[F](config, cache, backend))
}
