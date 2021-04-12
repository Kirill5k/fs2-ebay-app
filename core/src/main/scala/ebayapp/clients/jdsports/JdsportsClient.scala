package ebayapp.clients.jdsports

import cats.effect.{Sync, Timer}
import cats.implicits._
import ebayapp.clients.jdsports.mappers.{JdsportsItem, JdsportsItemMapper}
import ebayapp.clients.jdsports.parsers.{JdCatalogItem, JdItemDetails, JdItemStock, ResponseParser}
import ebayapp.common.Logger
import ebayapp.common.config.{JdsportsConfig, SearchQuery}
import ebayapp.domain.{ItemDetails, ResellableItem}
import fs2.Stream
import sttp.client3.{basicRequest, SttpBackend}
import sttp.client3._

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
    "User-Agent"      -> "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
    "Referer"         -> "https://www.jdsports.co.uk/men/brand/"
  )

  override def searchSale[D <: ItemDetails](query: SearchQuery)(implicit mapper: JdsportsItemMapper[D]): Stream[F, ResellableItem[D]] =
    Stream
      .evalSeq(searchByBrand(query))
      .filter(_.sale)
      .metered(100.millis)
      .evalMap { ci =>
        (getItem(ci), getStock(ci))
          .mapN { (details, stock) =>
            (details, stock).mapN((d, s) =>
              s.sizes.map { size =>
                JdsportsItem(
                  ci.plu,
                  ci.description,
                  d.UnitPrice,
                  d.PreviousUnitPrice,
                  d.Brand,
                  d.Colour,
                  size,
                  d.PrimaryImage,
                  d.Category
                )
              }
            )
          }
          .handleErrorWith { e =>
            logger.error(e)(e.getMessage) *> none[List[JdsportsItem]].pure[F]
          }
      }
      .unNone
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
          case Left(_) if r.code.isClientError || r.code.isServerError =>
            logger.error(s"error sending search request to jdsports: ${r.code}") *>
              F.pure(Nil)
          case Left(error) =>
            logger.error(s"error sending search request to jdsports: ${error}") *>
              T.sleep(1.second) *> searchByBrand(query)
        }
      }

  private def getStock(ci: JdCatalogItem): F[Option[JdItemStock]] =
    basicRequest
      .get(uri"${config.baseUri}/product/${ci.fullName}/${ci.plu}/quickview/stock")
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseStockResponse(html)).map(_.some)
          case Left(_) if r.code.isClientError || r.code.isServerError =>
            logger.error(s"error sending get stock request to jdsports: ${r.code}") *>
              F.pure(None)
          case Left(error) =>
            logger.error(s"error sending get stock request to jdsports: ${error}") *>
              T.sleep(1.second) *> getStock(ci)
        }
      }

  private def getItem(ci: JdCatalogItem): F[Option[JdItemDetails]] =
    basicRequest
      .get(uri"${config.baseUri}/product/${ci.fullName}/${ci.plu}/quickview")
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseItemDetails(html)).map(_.some)
          case Left(_) if r.code.isClientError || r.code.isServerError =>
            logger.error(s"error sending get item request to jdsports: ${r.code}") *>
              F.pure(None)
          case Left(error) =>
            logger.error(s"error sending get item request to jdsports: ${error}") *>
              T.sleep(1.second) *> getItem(ci)
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
