package ebayapp.core.clients.harveynichols

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.apply.*
import ebayapp.core.clients.harveynichols.mappers.{HarveyNicholsItem, HarveyNicholsItemMapper}
import ebayapp.core.clients.harveynichols.responses.{HarveyNicholsProduct, HarveyNicholsSearchResponse}
import ebayapp.core.clients.{Fs2HttpClient, SearchClient}
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import io.circe.Decoder
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.*
import sttp.client4.circe.asJson
import sttp.model.{StatusCode, Uri}

import scala.concurrent.duration.*

final private class LiveHarveyNicholsClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with Fs2HttpClient[F] {

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
          .map(HarveyNicholsItemMapper.clothing.toDomain(criteria))
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
      .flatMap { config =>
        dispatch {
          basicRequest
            .get(fullUri(config.uri))
            .headers(defaultHeaders ++ config.headers)
            .response(asJson[A])
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(res) =>
            F.pure(res)
          case Left(ResponseException.DeserializationException(_, error, _)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-$endpoint/exhausted input") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(ResponseException.DeserializationException(json, error, _)) =>
            logger.error(s"$name-$endpoint/json-parsing-error: ${error.getMessage}\n$json") *>
              F.pure(defaultResponse)
          case Left(ResponseException.UnexpectedStatusCode(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
            logger.error(s"$name-$endpoint/$s-critical") *>
              F.sleep(3.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(ResponseException.UnexpectedStatusCode(_, meta)) if meta.code.isClientError =>
            logger.error(s"$name-$endpoint/${meta.code}-error") *>
              F.pure(defaultResponse)
          case Left(ResponseException.UnexpectedStatusCode(_, meta)) if meta.code.isServerError =>
            logger.warn(s"$name-$endpoint/${meta.code}-repeatable") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
          case Left(error) =>
            logger.error(s"$name-$endpoint/error: ${error.getMessage}") *>
              F.sleep(5.second) *> sendRequest(fullUri, endpoint, defaultResponse)
        }
      }
}

object HarveyNicholsClient:
  def make[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveHarveyNicholsClient[F](() => configProvider.harveyNichols, backend))
