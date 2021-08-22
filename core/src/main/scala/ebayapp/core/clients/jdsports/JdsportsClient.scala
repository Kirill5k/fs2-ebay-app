package ebayapp.core.clients.jdsports

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.jdsports.mappers.{jdsportsClothingMapper, JdsportsItem}
import ebayapp.core.clients.jdsports.parsers.{JdCatalogItem, JdProduct, ResponseParser}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{GenericStoreConfig, SearchCriteria}
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import sttp.client3.{SttpBackend, basicRequest, _}
import sttp.model.StatusCode

import scala.concurrent.duration._

final private class LiveJdsportsClient[F[_]](
    private val config: GenericStoreConfig,
    override val name: String,
    override val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  private val headers: Map[String, String] = Map(
    "Referer"      -> s"https://www.$name.co.uk/men/",
    "X-Reroute-To" -> s"https://www.$name.co.uk"
  ) ++ defaultHeaders ++ config.headers

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    brands(criteria.query)
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
      .map(jdsportsClothingMapper.toDomain)
      .handleErrorWith { e =>
        Stream.eval(logger.error(e)(e.getMessage)).drain
      }

  private def brands(query: String): Stream[F, JdCatalogItem] =
    Stream
      .unfoldLoopEval(0) { step =>
        searchByBrand(query, step).map(items => (items, items.nonEmpty.guard[Option].as(step + 1)))
      }
      .flatMap(Stream.emits)

  private def searchByBrand(query: String, step: Int, stepSize: Int = 120): F[List[JdCatalogItem]] =
    dispatch() {
      val brand = query.toLowerCase.replace(" ", "-")
      basicRequest
        .get(uri"${config.baseUri}/men/brand/$brand/?max=$stepSize&from=${step * stepSize}&sort=price-low-high")
        .headers(headers)
    }.flatMap { r =>
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
    dispatch() {
      basicRequest
        .get(uri"${config.baseUri}/product/${ci.fullName}/${ci.plu}/stock")
        .headers(headers)
    }.flatMap { r =>
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
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveJdsportsClient[F](config, "jdsports", backend))

  def tessuti[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveJdsportsClient[F](config, "tessuti", backend))

  def scotts[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveJdsportsClient[F](config, "scottsmenswear", backend))
}
