package ebayapp.core.clients.nvidia

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.apply.*
import cats.syntax.applicative.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.nvidia.mappers.NvidiaItemMapper
import ebayapp.core.clients.nvidia.responses.{NvidiaItem, NvidiaSearchResponse, Product}
import ebayapp.core.common.{RetailConfigProvider, Logger}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import io.circe.DecodingFailure
import sttp.client3.circe.asJson
import sttp.client3.*
import sttp.model.{Header, MediaType}
import sttp.model.headers.CacheDirective

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
      .map { p =>
        p.retailers
          .filter(_.isAvailable)
          .map(r => NvidiaItem(p.displayName, p.imageURL, p.category, r))
      }
      .flatMap(Stream.emits)
      .map(NvidiaItemMapper.generic.toDomain(criteria))

  private def searchProducts(c: SearchCriteria): F[List[Product]] =
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          emptyRequest
            .acceptEncoding(acceptAnything)
            .header(Header.accept(MediaType.ApplicationJson, MediaType.TextPlain))
            .header(Header.cacheControl(CacheDirective.NoCache, CacheDirective.NoStore))
            .header(Header.userAgent(postmanUserAgent))
            .header("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
            .header("origin", "https://store.nvidia.com")
            .header("referrer", "https://store.nvidia.com")
            .get(uri"${config.baseUri}/edge/product/search?page=1&limit=512&locale=en-gb&search=${c.query}&category=${c.category}")
            .response(asJson[NvidiaSearchResponse])
            .headers(config.headers)
        }
      }
      .flatMap { r =>
        r.body match
          case Right(response) =>
            F.pure(response.searchedProducts.featuredProduct.toList ::: response.searchedProducts.productDetails)
          case Left(DeserializationException(body, error)) =>
            val circeError = error.asInstanceOf[DecodingFailure]
            logger.error(s"$name-search/parsing-error: ${circeError.getMessage} (${circeError.pathToRootString})\n$body") *>
              List.empty[Product].pure[F]
          case Left(HttpError(body, status)) if status.isClientError || status.isServerError =>
            logger.warn(s"$name-search/$status-error, \n$body") *>
              F.sleep(10.seconds) *> searchProducts(c)
          case Left(error) =>
            logger.error(s"$name-search/error: ${error.getMessage}\n$error") *>
              F.sleep(10.second) *> searchProducts(c)
      }
}

object NvidiaClient:
  def make[F[_]: Temporal: Logger](
                                    configProvider: RetailConfigProvider[F],
                                    backend: SttpBackend[F, Any],
                                    proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveNvidiaClient[F](() => configProvider.nvidia, backend, proxyBackend))
