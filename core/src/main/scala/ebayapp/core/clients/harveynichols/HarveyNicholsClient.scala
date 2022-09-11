package ebayapp.core.clients.harveynichols

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.apply.*
import ebayapp.core.clients.harveynichols.mappers.*
import ebayapp.core.clients.harveynichols.responses.{HarveyNicholsProduct, HarveyNicholsSearchResponse}
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import io.circe.Decoder
import sttp.client3.*
import sttp.client3.circe.asJson
import sttp.model.{StatusCode, Uri}

import scala.concurrent.duration.*

final private class LiveHarveyNicholsClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F, GenericRetailerConfig] {

  override protected val name: String = "harvey-nichols"

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(configProvider())
      .flatMap { config =>
        Stream
          .unfoldLoopEval(1)(searchForProducts(criteria))
          .metered(config.delayBetweenIndividualRequests.getOrElse(Duration.Zero))
          .flatMap(Stream.emits)
          .flatMap { product =>
            Stream.emits {
              product.variant_display_size.value.getOrElse(Nil).map { size =>
                HarveyNicholsItem(
                  name = product.name.value,
                  brand = product.brand.value,
                  size = size,
                  currentPrice = product.price.encoded,
                  originalPrice = product.original_price.encoded,
                  discount = Some(product.percentage_discount.encoded).filter(_ > 0),
                  itemUrl = product.product_brand_url.value,
                  imageUrl = product._imageurl.value
                )
              }
            }
          }
          .map(harveyNicholsClothingMapper.toDomain(criteria))
      }

  private def searchForProducts(criteria: SearchCriteria)(page: Int): F[(List[HarveyNicholsProduct], Option[Int])] = {
    val queryParams = Map(
      "query"                  -> s"//search=${criteria.query}/categories=cp2_cp134/",
      "context[page_number]"   -> s"$page",
      "context[fh_sort_by]"    -> "price",
      "context[sort_by]"       -> "low_to_high",
      "context[country_code]"  -> "GB",
      "context[site]"          -> "UK",
      "context[customer_dept]" -> "Mens",
      "context[region]"        -> "United Kingdom"
    )
    sendRequest[HarveyNicholsSearchResponse](
      baseUri => uri"$baseUri/data/lister?$queryParams",
      "search",
      HarveyNicholsSearchResponse.empty
    )
      .map(_.universe.products)
      .map(ps => (ps, Option.when(ps.nonEmpty)(page + 1)))
  }

  private def sendRequest[A: Decoder](fullUri: String => Uri, endpoint: String, defaultResponse: A): F[A] =
    configProvider()
      .map { config =>
        basicRequest
          .get(fullUri(config.baseUri))
          .headers(config.headers)
          .response(asJson[A])
      }
      .flatMap(dispatch)
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure(res)
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-$endpoint/exhausted input") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(DeserializationException(json, error)) =>
            logger.error(s"$name-$endpoint/json-parsing-error: ${error.getMessage}\n$json") *>
              F.pure(defaultResponse)
          case Left(HttpError(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
            logger.error(s"$name-$endpoint/$s-critical") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(HttpError(_, status)) if status.isClientError =>
            logger.error(s"$name-$endpoint/$status-error") *>
              F.pure(defaultResponse)
          case Left(HttpError(_, status)) if status.isServerError =>
            logger.warn(s"$name-$endpoint/$status-repeatable") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(error) =>
            logger.error(s"$name-$endpoint/error: ${error.getMessage}") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
        }
      }
}

object HarveyNicholsClient:
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveHarveyNicholsClient[F](() => configProvider.harveyNichols, backend, proxyBackend))
