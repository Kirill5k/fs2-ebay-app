package ebayapp.core.clients.jdsports

import cats.effect.{Sync, Timer}
import cats.implicits._
import ebayapp.core.clients.jdsports.mappers.{JdsportsItem, JdsportsItemMapper}
import ebayapp.core.clients.jdsports.parsers.{JdCatalogItem, JdProduct, ResponseParser}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{JdsportsConfig, SearchQuery}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream
import sttp.client3.{SttpBackend, basicRequest, _}
import sttp.model.StatusCode

import scala.concurrent.duration._

trait JdsportsClient[F[_]] {
  def searchSale[D <: ItemDetails: JdsportsItemMapper](query: SearchQuery): Stream[F, ResellableItem[D]]
}

final private class LiveJdsportsClient[F[_]](
    private val config: JdsportsConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Sync[F],
    T: Timer[F],
    logger: Logger[F]
) extends JdsportsClient[F] {

  private val defaultHeaders: Map[String, String] = Map(
    "Connection"      -> "keep-alive",
    "Accept"          -> "*/*",
    "Accept-Encoding" -> "gzip, deflate, br",
    "Cache-Control"   -> "no-store, max-age=0",
    "User-Agent"      -> "Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",
    "Referer"         -> "https://www.jdsports.co.uk/men/brand/"
  )

  override def searchSale[D <: ItemDetails](query: SearchQuery)(implicit mapper: JdsportsItemMapper[D]): Stream[F, ResellableItem[D]] =
    Stream
      .evalSeq(searchByBrand(query))
      .filter(_.sale)
      .metered(100.millis)
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

  private def searchByBrand(query: SearchQuery): F[List[JdCatalogItem]] =
    basicRequest
      .get(uri"${config.baseUri}/men/brand/${query.value.toLowerCase.replace(" ", "-")}/?max=408&sort=price-low-high")
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(_) if r.code == StatusCode.Forbidden =>
            logger.warn(s"jdsports-search/forbidden") *>
              T.sleep(30.seconds) *> searchByBrand(query)
          case Left(_) if r.code.isClientError || r.code.isServerError =>
            logger.error(s"jdsports-search/${r.code}-error") *>
              F.pure(Nil)
          case Left(error) =>
            logger.error(s"jdsports-search error: $error") *>
              T.sleep(1.second) *> searchByBrand(query)
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
          case Left(_) if r.code.isClientError || r.code.isServerError =>
            logger.error(s"jdsports-get-stock/${r.code}-error") *>
              F.pure(None)
          case Left(error) =>
            logger.error(s"jdsports-get-stock: $error") *>
              T.sleep(1.second) *> getProductStock(ci)
        }
      }
}

object JdsportsClient {
  def make[F[_]: Sync: Logger: Timer](
      config: JdsportsConfig,
      backend: SttpBackend[F, Any]
  ): F[JdsportsClient[F]] =
    Sync[F].delay(new LiveJdsportsClient[F](config, backend))
}
