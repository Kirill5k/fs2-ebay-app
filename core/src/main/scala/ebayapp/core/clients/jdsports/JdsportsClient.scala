package ebayapp.core.clients.jdsports

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.jdsports.mappers.{JdsportsItem, JdsportsItemMapper}
import ebayapp.core.clients.jdsports.parsers.{JdCatalogItem, JdProduct, ResponseParser}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{GenericStoreConfig, SearchCategory, SearchQuery}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream
import sttp.client3.{SttpBackend, basicRequest, _}
import sttp.model.StatusCode

import scala.concurrent.duration._

trait JdsportsClient[F[_]] extends SearchClient[F, JdsportsItem]

final private class LiveJdsportsClient[F[_]](
    private val config: GenericStoreConfig,
    private val name: String,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends JdsportsClient[F] {

  private val defaultHeaders: Map[String, String] = Map(
    "Connection"      -> "keep-alive",
    "Accept"          -> "*/*",
    "Accept-Encoding" -> "gzip, deflate, br",
    "Cache-Control"   -> "no-store, max-age=0",
    "User-Agent"      -> "Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",
    "Referer"         -> s"https://www.$name.co.uk/men/",
    "X-Reroute-To"    -> s"https://www.$name.co.uk"
  )

  override def search[D <: ItemDetails](
      query: SearchQuery,
      category: Option[SearchCategory]
  )(implicit
      mapper: JdsportsItemMapper[D]
  ): Stream[F, ResellableItem[D]] =
    brands(query)
      .filter(_.sale)
      .metered(250.millis)
      .evalMap(ci => getProductStock(ci))
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
            p.details.Category
          )
        }
      }
      .flatMap(Stream.emits)
      .map(mapper.toDomain)
      .handleErrorWith { e =>
        Stream.eval(logger.error(e)(e.getMessage)).drain
      }

  private def brands(query: SearchQuery): Stream[F, JdCatalogItem] =
    Stream.unfoldLoopEval(0) { step =>
      searchByBrand(query, step).map(items => (items, items.nonEmpty.guard[Option].as(step+1)))
    }.flatMap(Stream.emits)

  private def searchByBrand(query: SearchQuery, step: Int, stepSize: Int = 40): F[List[JdCatalogItem]] =
    basicRequest
      .get(
        uri"${config.baseUri}/men/brand/${query.value.toLowerCase.replace(" ", "-")}/?max=$stepSize&from=${step * stepSize}&sort=price-low-high"
      )
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(_) if r.code == StatusCode.Forbidden =>
            logger.error(s"$name-search/forbidden") *>
              F.sleep(30.seconds) *> searchByBrand(query, step)
          case Left(_) if r.code == StatusCode.NotFound =>
            logger.warn(s"$name-search/404") *>
              F.pure(Nil)
          case Left(_) if r.code.isClientError =>
            logger.error(s"$name-search/${r.code}-error") *>
              F.pure(Nil)
          case Left(_) if r.code.isServerError =>
            logger.warn(s"$name-search/${r.code}-repeatable") *>
              F.sleep(3.second) *> searchByBrand(query, step)
          case Left(error) =>
            logger.error(s"$name-search/error: $error") *>
              F.sleep(3.second) *> searchByBrand(query, step)
        }
      }

  private def getProductStock(ci: JdCatalogItem): F[Option[JdProduct]] =
    basicRequest
      .get(uri"${config.baseUri}/product/${ci.fullName}/${ci.plu}/stock")
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseProductStockResponse(html))
          case Left(_) if r.code == StatusCode.NotFound =>
            logger.warn(s"$name-get-stock/404") *>
              F.pure(None)
          case Left(_) if r.code.isClientError =>
            logger.error(s"$name-get-stock/${r.code}-error") *>
              F.pure(None)
          case Left(_) if r.code.isServerError =>
            logger.warn(s"$name-get-stock/${r.code}-repeatable") *>
              F.sleep(1.second) *> getProductStock(ci)
          case Left(error) =>
            logger.error(s"$name-get-stock: $error") *>
              F.sleep(1.second) *> getProductStock(ci)
        }
      }
}

object JdsportsClient {
  def jd[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[JdsportsClient[F]] =
    Monad[F].pure(new LiveJdsportsClient[F](config, "jdsports", backend))

  def tessuti[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[JdsportsClient[F]] =
    Monad[F].pure(new LiveJdsportsClient[F](config, "tessuti", backend))
}
