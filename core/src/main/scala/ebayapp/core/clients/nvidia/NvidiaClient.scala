package ebayapp.core.clients.nvidia

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.SearchClient
import io.circe.generic.auto._
import ebayapp.core.clients.nvidia.mappers.nvidiaGenericItemMapper
import ebayapp.core.clients.nvidia.responses.{NvidiaItem, NvidiaSearchResponse, Product}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{GenericStoreConfig, SearchCategory, SearchQuery}
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import sttp.client3.circe.asJson
import sttp.client3._

import scala.concurrent.duration._

final private class LiveNvidiaClient[F[_]](
    private val config: GenericStoreConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    logger: Logger[F],
    timer: Temporal[F]
) extends SearchClient[F] {

  private val defaultHeaders: Map[String, String] = Map(
    "Access-Control-Allow-Origin" -> "*",
    "Content-Type"                -> "application/json",
    "Connection"                  -> "keep-alive",
    "Accept"                      -> "*/*",
    "Accept-Encoding"             -> "gzip, deflate, br",
    "Cache-Control"               -> "no-store, max-age=0",
    "User-Agent"                  -> "PostmanRuntime/7.28.3",
    "X-Reroute-To"                -> "https://api.nvidia.partners",
    "Cookie" -> "ak_bmsc=BE502843B587C9DA16D4A1C6448BABCB~000000000000000000000000000000~YAAQD+YYPh+tea56AQAAOCQvUAz9b8GZc1KmIastBUnrK9GRtE9+COuoh3rwvDKKlV0powuG0bT5zVx5h0RURKwGVMK3/ZNhxNRdqnlgrfFT89Ij3x5GRtAf1uqij5cvLIC+9NfTGz+LExcH3JmU/q7Pv5O58l1Sf1I0efrKR8tHe85pzre1G2oUf+LYP6UB4b8boydMECM22Lgfx4TTLnIAKliKb2gUiA0rFjp3YVPTr9qIXsTjPVXVNdxPpsnOUOzlReLah13U0LVnBV5u3Yzpp2LOtgJWkPAz1ZA03r8wUpqPtpODoix2Sky56f86QPC2v/bsoZO1VutENbIiiQ6JsI3sRZwDAKBRL2PadfcBLFB8xGxb2I4tQAlbSg=="
  ) ++ config.headers

  override def search(
      query: SearchQuery,
      category: Option[SearchCategory]
  ): Stream[F, ResellableItem.Anything] =
    Stream
      .evalSeq(searchProducts(query, category))
      .filterNot(_.isOutOfStock)
      .flatMap { p =>
        Stream.emits(p.retailers.map(r => NvidiaItem(p.productTitle, p.imageURL, p.category, r)))
      }
      .map(nvidiaGenericItemMapper.toDomain)

  private def searchProducts(q: SearchQuery, c: Option[SearchCategory]): F[List[Product]] =
    basicRequest
      .get(uri"${config.baseUri}/edge/product/search?page=1&limit=512&locale=en-gb&search=${q.value}&category=${c.map(_.value)}")
      .response(asJson[NvidiaSearchResponse])
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(response) => response.searchedProducts.productDetails.pure[F]
          case Left(DeserializationException(body, error)) =>
            logger.error(s"nvidia-search/parsing-error: ${error.getMessage}, \n$body") *>
              List.empty[Product].pure[F]
          case Left(HttpError(body, status)) if status.isClientError || status.isServerError =>
            logger.error(s"nvidia-search/$status-error, \n$body") *>
              timer.sleep(10.seconds) *> searchProducts(q, c)
          case Left(error) =>
            logger.error(s"nvidia-search/error: ${error.getMessage}\n$error") *>
              timer.sleep(10.second) *> searchProducts(q, c)
        }
      }
}

object NvidiaClient {
  def make[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveNvidiaClient[F](config, backend))
}
