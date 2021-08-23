package ebayapp.core.clients.selfridges

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.{HttpClient, SearchClient, SearchCriteria}
import ebayapp.core.clients.selfridges.mappers.{SelfridgesItem, selfridgesClothingMapper}
import ebayapp.core.clients.selfridges.responses._
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericStoreConfig
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
    override val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "selfridges"

  private val headers = defaultHeaders ++ config.headers

  private val filters: String = List(
    "\\d+-\\d+ (year|month)",
    "thong",
    "\\bBRA\\b",
    "bikini",
    "jersey brief",
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
      .unfoldLoopEval(1)(searchForItems(criteria))
      .flatMap(Stream.emits)
      .filter(!_.name.matches(filters))
      .filter(_.price.exists(p => p.lowestWasPrice.isDefined || p.lowestWasWasPrice.isDefined))
      .flatMap { item =>
        Stream
          .evalSeq(getItemDetails(item))
          .metered(1.second)
          .map { case (stock, price) => SelfridgesItem(item, stock, price) }
      }
      .map(selfridgesClothingMapper.toDomain)
      .filter(_.buyPrice.quantityAvailable > 0)

  private def getItemDetails(item: CatalogItem): F[List[(ItemStock, Option[ItemPrice])]] =
    (getItemStock(item.partNumber), getItemPrice(item.partNumber))
      .mapN { case (stock, prices) =>
        val pricesBySkuid = prices.groupBy(_.SKUID)
        stock.map(s => (s, pricesBySkuid.get(s.SKUID).flatMap(_.headOption)))
      }

  private def searchForItems(criteria: SearchCriteria)(page: Int): F[(List[CatalogItem], Option[Int])] =
    sendRequest[SelfridgesSearchResponse](
      uri"${config.baseUri}/api/cms/ecom/v1/GB/en/productview/byCategory/byIds?ids=${criteria.query.replaceAll(" ", "-")}&pageNumber=$page&pageSize=60",
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
    dispatch() {
      basicRequest
        .get(uri)
        .headers(headers)
        .response(asJson[A])
    }.flatMap { r =>
      r.body match {
        case Right(res) =>
          F.pure(res)
        case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
          logger.warn(s"$name-$endpoint/exhausted input") *>
            F.sleep(3.second) *> sendRequest(uri, endpoint, defaultResponse)
        case Left(DeserializationException(_, error)) =>
          logger.error(s"$name-$endpoint response parsing error: ${error.getMessage}") *>
            F.pure(defaultResponse)
        case Left(HttpError(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
          logger.error(s"$name-$endpoint/$s-critical") *>
            F.sleep(3.second) *> sendRequest(uri, endpoint, defaultResponse)
        case Left(HttpError(_, status)) if status.isClientError =>
          logger.error(s"$name-$endpoint/$status-error") *>
            F.pure(defaultResponse)
        case Left(HttpError(_, status)) if status.isServerError =>
          logger.warn(s"$name-$endpoint/$status-repeatable") *>
            F.sleep(5.second) *> sendRequest(uri, endpoint, defaultResponse)
        case Left(error) =>
          logger.error(s"$name-$endpoint/error: ${error.getMessage}") *>
            F.sleep(5.second) *> sendRequest(uri, endpoint, defaultResponse)
      }
    }
}

object SelfridgesClient {

  def make[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveSelfridgesClient[F](config, backend))
}
