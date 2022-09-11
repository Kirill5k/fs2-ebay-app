package ebayapp.core.clients.jdsports

import cats.Monad
import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.jdsports.mappers.{jdsportsClothingMapper, JdsportsItem}
import ebayapp.core.clients.jdsports.parsers.{JdCatalogItem, JdProduct, ResponseParser}
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.client3.*
import sttp.model.StatusCode

import scala.concurrent.duration.*

final private class LiveJdsportsClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val name: String,
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F, GenericRetailerConfig] {

  private val getBrandHeaders = Map(
    "cookie" -> "language=en; AKA_A2=A; 49746=; gdprsettings2={\"functional\":false,\"performance\":false,\"targeting\":false}; gdprsettings3={\"functional\":false,\"performance\":false,\"targeting\":false};",
    "accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding"           -> "gzip, deflate, br",
    "accept-language"           -> "en-GB,en;q=0.9",
    "upgrade-insecure-requests" -> "1",
    "user-agent"                -> operaUserAgent,
    "sec-ch-ua"                 -> """"Opera";v="89", "Chromium";v="103", "_Not:A-Brand";v="24"""",
    "sec-ch-ua-mobile"          -> "?0",
    "sec-ch-ua-platform"        -> "macOS",
    "sec-fetch-dest"            -> "document",
    "sec-fetch-mode"            -> "navigate",
    "sec-fetch-site"            -> "same-origin",
    "sec-fetch-user"            -> "?1"
  )

  private val getStockHeaders = Map(
    "accept"             -> "*/*",
    "accept-encoding"    -> "gzip, deflate, br",
    "accept-language"    -> "en-GB,en;q=0.9",
    "content-type"       -> "application/json",
    "x-requested-with"   -> "XMLHttpRequest",
    "user-agent"         -> operaUserAgent,
    "sec-ch-ua"          -> """"Opera";v="89", "Chromium";v="103", "_Not:A-Brand";v="24"""",
    "sec-ch-ua-mobile"   -> "?0",
    "sec-ch-ua-platform" -> "macOS",
    "sec-fetch-dest"     -> "empty",
    "sec-fetch-mode"     -> "cors",
    "sec-fetch-site"     -> "same-origin"
  )

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream.eval(configProvider()).flatMap { config =>
      brands(criteria)
        .filter(_.sale)
        .metered(config.delayBetweenIndividualRequests.getOrElse(0.second))
        .evalMap(getProductStock)
        .unNone
        .map { p =>
          p.availableSizes.map { size =>
            JdsportsItem(
              p.details.Id,
              p.details.Name,
              p.details.UnitPrice,
              p.details.PreviousUnitPrice,
              p.details.Brand,
              p.details.Colour,
              size,
              p.details.PrimaryImage,
              p.details.Category,
              config.websiteUri,
              name
            )
          }
        }
        .flatMap(Stream.emits)
        .map(jdsportsClothingMapper.toDomain(criteria))
        .handleErrorWith(e => Stream.eval(logger.error(e)(e.getMessage)).drain)
    }

  private def brands(criteria: SearchCriteria): Stream[F, JdCatalogItem] =
    Stream
      .unfoldLoopEval(0) { step =>
        searchByBrand(criteria, step).map(items => (items, Option.when(items.nonEmpty)(step + 1)))
      }
      .flatMap(Stream.emits)

  private def searchByBrand(criteria: SearchCriteria, step: Int, stepSize: Int = 120): F[List[JdCatalogItem]] =
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          val base  = config.baseUri + criteria.category.fold("")(c => s"/$c")
          val brand = criteria.query.toLowerCase.replace(" ", "-")
          basicRequest
            .get(uri"$base/brand/$brand/?max=$stepSize&from=${step * stepSize}&sort=price-low-high")
            .headers(getBrandHeaders ++ config.headers + ("referer" -> config.websiteUri))
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(_) if r.code == StatusCode.Forbidden =>
            logger.warn(s"$name-search/403") *> F.sleep(10.seconds) *> searchByBrand(criteria, step)
          case Left(_) if r.code == StatusCode.NotFound && step == 0 =>
            logger.warn(s"$name-search/404 - ${r.request.uri.toString()}") *> F.pure(Nil)
          case Left(_) if r.code == StatusCode.NotFound =>
            F.pure(Nil)
          case Left(_) if r.code.isClientError =>
            logger.error(s"$name-search/${r.code}-error") *> F.pure(Nil)
          case Left(_) if r.code.isServerError =>
            logger.warn(s"$name-search/${r.code}-repeatable") *> F.sleep(3.second) *> searchByBrand(criteria, step)
          case Left(error) =>
            logger.error(s"$name-search/error: $error") *> F.sleep(3.second) *> searchByBrand(criteria, step)
        }
      }

  private def getProductStock(ci: JdCatalogItem): F[Option[JdProduct]] =
    configProvider()
      .flatMap { config =>
        dispatchWithProxy(config.proxied) {
          val referrer = config.websiteUri + s"product/${ci.fullName}/${ci.plu}/"
          basicRequest
            .get(uri"${config.baseUri}/product/${ci.fullName}/${ci.plu}/stock/")
            .headers(getStockHeaders ++ config.headers + ("referer" -> referrer))
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseProductStockResponse(html))
          case Left(_) if r.code == StatusCode.Forbidden =>
            logger.warn(s"$name-get-stock/403") *> F.sleep(10.second) *> getProductStock(ci)
          case Left(_) if r.code == StatusCode.NotFound =>
            logger.warn(s"$name-get-stock/404") *> F.pure(None)
          case Left(_) if r.code.isClientError =>
            logger.error(s"$name-get-stock/${r.code}-error") *> F.pure(None)
          case Left(_) if r.code.isServerError =>
            logger.warn(s"$name-get-stock/${r.code}-repeatable") *> F.sleep(1.second) *> getProductStock(ci)
          case Left(error) =>
            logger.error(s"$name-get-stock: $error") *> F.sleep(1.second) *> getProductStock(ci)
        }
      }

  extension (c: GenericRetailerConfig) def websiteUri = c.headers.getOrElse("X-Reroute-To", c.baseUri) + "/"
}

object JdsportsClient {
  def jd[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveJdsportsClient[F](() => configProvider.jdsports, "jdsports", backend, proxyBackend))

  def tessuti[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveJdsportsClient[F](() => configProvider.tessuti, "tessuti", backend, proxyBackend))

  def scotts[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveJdsportsClient[F](() => configProvider.scotts, "scotts", backend, proxyBackend))
}
