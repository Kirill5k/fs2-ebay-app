package ebayapp.core.clients.harveynichols

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.apply.*
import cats.syntax.alternative.*
import ebayapp.core.clients.harveynichols.mappers.*
import ebayapp.core.clients.harveynichols.responses.{HarveyNicholsProduct, HarveyNicholsSearchResponse}
import ebayapp.core.clients.{HttpClient, SearchClient, SearchCriteria}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import io.circe.Decoder
import sttp.client3.*
import sttp.client3.circe.asJson
import sttp.model.{StatusCode, Uri}

import scala.concurrent.duration.*

final private class LiveHarveyNicholsClient[F[_]](
    private val config: GenericRetailerConfig,
    override val backend: SttpBackend[F, Any]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "harvey-nichols"

  private val headers = defaultHeaders ++ config.headers

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .unfoldLoopEval(1)(searchForProducts(criteria))
      .flatMap(Stream.emits)
      .flatMap { product =>
        Stream.emits {
          product.variant_display_size.value.map { size =>
            HarveyNicholsItem(
              name = product.name.value,
              brand = product.brand.value,
              size = size,
              currentPrice = product.price.value,
              originalPrice = product.original_price.value,
              discount = product.percentage_discount.map(_.encoded),
              itemUrl = product.product_brand_url.value,
              imageUrl = product._imageurl.value
            )
          }
        }
      }
      .map(harveyNicholsClothingMapper.toDomain)

  private def searchForProducts(criteria: SearchCriteria)(page: Int): F[(List[HarveyNicholsProduct], Option[Int])] = {
    val queryParams = Map(
      "query"                     -> s"//search=${criteria.query}/categories=cp2_cp134/",
      "context[page_number]"      -> s"$page",
      "context[customer_type]"    -> "Public",
      "context[hn_page_template]" -> "Search Lister",
      "context[channel]"          -> "Desktop",
      "context[fh_sort_by]"       -> "price",
      "context[sort_by]"          -> "low_to_high",
      "context[country_code]"     -> "GB",
      "context[site]"             -> "UK",
      "context[customer_dept]"    -> "Mens",
      "context[region]"           -> "United Kingdom",
      "context[storeCode]"        -> "default",
      "context[query]"            -> s"//search=${criteria.query}/categories=cp2_cp134/sort_by=low_to_high/",
      "meta[searchTerm]"          -> criteria.query,
      "meta[categoryIdPath][]"    -> "134",
      "meta[categoryId]"          -> "134"
    )
    sendRequest[HarveyNicholsSearchResponse](
      uri"${config.baseUri}/data/lister/?$queryParams",
      "search",
      HarveyNicholsSearchResponse.empty
    )
      .map(_.universe.products)
      .map(is => (is, is.nonEmpty.guard[Option].as(page + 1)))
  }

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

object HarveyNicholsClient {

  def make[F[_]: Temporal: Logger](
      config: GenericRetailerConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveHarveyNicholsClient[F](config, backend))
}
