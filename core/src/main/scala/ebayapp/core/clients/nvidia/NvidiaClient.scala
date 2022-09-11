package ebayapp.core.clients.nvidia

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.functorFilter.*
import cats.syntax.apply.*
import cats.syntax.applicative.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.nvidia.mappers.nvidiaGenericItemMapper
import ebayapp.core.clients.nvidia.responses.{NvidiaItem, NvidiaSearchResponse, Product}
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.client3.circe.asJson
import sttp.client3.*

import scala.concurrent.duration.*

final private class LiveNvidiaClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    logger: Logger[F],
    F: Temporal[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String                         = "nvidia"
  override protected val delayBetweenFailures: FiniteDuration = 2.seconds

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .evalSeq(searchProducts(criteria))
      .filterNot(_.isOutOfStock)
      .flatMap { p =>
        Stream.emits(p.retailers.map(r => NvidiaItem(p.productTitle, p.imageURL, p.category, r)))
      }
      .map(nvidiaGenericItemMapper.toDomain(criteria))

  private def searchProducts(c: SearchCriteria): F[List[Product]] =
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          basicRequest
            .get(uri"${config.baseUri}/edge/product/search?page=1&limit=512&locale=en-gb&search=${c.query}&category=${c.category}")
            .response(asJson[NvidiaSearchResponse])
            .headers(defaultHeaders ++ config.headers)
        }
      }
      .flatMap { r =>
        r.body match
          case Right(response) =>
            response.searchedProducts.productDetails.pure[F]
          case Left(DeserializationException(body, error)) =>
            logger.error(s"$name-search/parsing-error: ${error.getMessage}, \n$body") *>
              List.empty[Product].pure[F]
          case Left(HttpError(body, status)) if status.isClientError || status.isServerError =>
            logger.error(s"$name-search/$status-error, \n$body") *>
              F.sleep(10.seconds) *> searchProducts(c)
          case Left(error) =>
            logger.error(s"$name-search/error: ${error.getMessage}\n$error") *>
              F.sleep(10.second) *> searchProducts(c)
      }
}

object NvidiaClient:
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveNvidiaClient[F](() => configProvider.nvidia, backend, proxyBackend))
