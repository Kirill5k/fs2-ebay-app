package ebayapp.core.clients.nvidia

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap._
import cats.syntax.functorFilter._
import cats.syntax.apply._
import cats.syntax.applicative._
import ebayapp.core.clients.{HttpClient, SearchClient, SearchCriteria}
import io.circe.generic.auto._
import ebayapp.core.clients.nvidia.mappers.nvidiaGenericItemMapper
import ebayapp.core.clients.nvidia.responses.{NvidiaItem, NvidiaSearchResponse, Product}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import sttp.client3.circe.asJson
import sttp.client3._

import scala.concurrent.duration._

final private class LiveNvidiaClient[F[_]](
                                            private val config: GenericRetailerConfig,
                                            override val backend: SttpBackend[F, Any]
)(implicit
    logger: Logger[F],
    timer: Temporal[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "nvidia"

  private val headers: Map[String, String] = defaultHeaders ++ config.headers

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .evalSeq(searchProducts(criteria))
      .filterNot(_.isOutOfStock)
      .flatMap { p =>
        Stream.emits(p.retailers.map(r => NvidiaItem(p.productTitle, p.imageURL, p.category, r)))
      }
      .map(nvidiaGenericItemMapper.toDomain)

  private def searchProducts(c: SearchCriteria): F[List[Product]] =
    dispatch() {
      basicRequest
        .get(uri"${config.baseUri}/edge/product/search?page=1&limit=512&locale=en-gb&search=${c.query}&category=${c.category}")
        .response(asJson[NvidiaSearchResponse])
        .headers(headers)
    }.flatMap { r =>
      r.body match {
        case Right(response) =>
          response.searchedProducts.productDetails.pure[F]
        case Left(DeserializationException(body, error)) =>
          logger.error(s"$name-search/parsing-error: ${error.getMessage}, \n$body") *>
            List.empty[Product].pure[F]
        case Left(HttpError(body, status)) if status.isClientError || status.isServerError =>
          logger.error(s"$name-search/$status-error, \n$body") *>
            timer.sleep(10.seconds) *> searchProducts(c)
        case Left(error) =>
          logger.error(s"$name-search/error: ${error.getMessage}\n$error") *>
            timer.sleep(10.second) *> searchProducts(c)
      }
    }
}

object NvidiaClient {
  def make[F[_]: Temporal: Logger](
                                    config: GenericRetailerConfig,
                                    backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveNvidiaClient[F](config, backend))
}
