package ebayapp.core.clients.jd

import cats.Monad
import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.jd.mappers.{JdsportsItem, JdsportsItemMapper}
import ebayapp.core.clients.jd.parsers.{JdCatalogItem, JdProduct, ResponseParser}
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.Retailer
import kirill5k.common.cats.syntax.stream.*
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.client3.*
import sttp.model.{HeaderNames, StatusCode}

import scala.concurrent.duration.*

final private class LiveJdClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val retailer: Retailer.Jdsports.type,
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = retailer.name

  private val getBrandHeaders = Map(
    HeaderNames.Cookie -> "language=en; AKA_A2=A; 49746=; gdprsettings2={\"functional\":false,\"performance\":false,\"targeting\":false}; gdprsettings3={\"functional\":false,\"performance\":false,\"targeting\":false};",
    HeaderNames.Accept -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    HeaderNames.AcceptEncoding  -> "*/*",
    HeaderNames.AcceptLanguage  -> "en-GB,en;q=0.9",
    HeaderNames.UserAgent       -> operaUserAgent,
    HeaderNames.ContentType     -> "application/json",
    "upgrade-insecure-requests" -> "1"
  )

  private val getStockHeaders = Map(
    HeaderNames.Accept         -> "*/*",
    HeaderNames.AcceptEncoding -> "*/*",
    HeaderNames.AcceptLanguage -> "en-GB,en;q=0.9",
    HeaderNames.UserAgent      -> operaUserAgent
  )

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream.eval(configProvider()).flatMap { config =>
      brandItems(criteria)
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
        .map(JdsportsItemMapper.clothing.toDomain(criteria))
        .handleErrorWith(e => Stream.logError(e)(e.getMessage))
    }

  private def brandItems(criteria: SearchCriteria): Stream[F, JdCatalogItem] =
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
          emptyRequest
            .get(uri"$base/brand/$brand/?max=$stepSize&from=${step * stepSize}&sort=price-low-high")
            .headers(getBrandHeaders ++ config.headers + (HeaderNames.Referer -> (config.websiteUri + "/")))
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(_) if r.code == StatusCode.Forbidden =>
            logger.error(s"$name-search/403") *> F.sleep(5.minutes) *> searchByBrand(criteria, step)
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
          val referrer = config.websiteUri + s"/product/${ci.fullName}/${ci.plu}/"
          emptyRequest
            .get(uri"${config.baseUri}/product/${ci.fullName}/${ci.plu}/stock/")
            .headers(getStockHeaders ++ config.headers + (HeaderNames.Referer -> referrer))
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
}

object JdClient:
  def jdsports[F[_]: Temporal: Logger](
      configProvider: RetailConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveJdClient[F](() => configProvider.jdsports, Retailer.Jdsports, backend, proxyBackend))
