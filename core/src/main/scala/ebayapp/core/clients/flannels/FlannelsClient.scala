package ebayapp.core.clients.flannels

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.flannels.mappers.{FlannelsItem, flannelsClothingMapper}
import ebayapp.core.clients.flannels.responses.{FlannelsProduct, FlannelsSearchResponse}
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.client3.*
import sttp.client3.circe.asJson
import sttp.model.headers.CacheDirective
import sttp.model.{Header, MediaType, StatusCode, Uri}

import scala.concurrent.duration.*

final private class LiveFlannelsClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "flannels"

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(configProvider())
      .flatMap { config =>
        Stream
          .unfoldLoopEval(1)(getItems(criteria))
          .metered(config.delayBetweenIndividualRequests.getOrElse(Duration.Zero))
          .flatMap(Stream.emits)
          .filter(_.isOnSale)
          .flatMap { product =>
            Stream.emits(product.sizes.split(", ").toList.map(s => FlannelsItem(product, s)))
          }
          .map(flannelsClothingMapper.toDomain(criteria))
      }

  private def getItems(sc: SearchCriteria)(page: Int = 1): F[(List[FlannelsProduct], Option[Int])] =
    configProvider()
      .flatMap { config =>
        val args = Map(
          "categoryId" -> s"FLAN_TM${sc.query.toUpperCase.replaceAll("[ -]", "")}",
          "page" -> page.toString,
          "productsPerPage" -> "100",
          "sortOption" -> "discountvalue_desc",
          "isSearch" -> "false",
          "clearFilters" -> "false",
          "pathName" -> s"/${sc.query.replaceAll(" ", "-")}${sc.category.fold("")(c => s"/$c")}",
          "selectedCurrency" -> "GBP"
        )
        dispatchWithProxy(config.proxied) {
          emptyRequest
            .maxRedirects(0)
            .acceptEncoding(gzipDeflateEncoding)
            .header(Header.accept(MediaType.ApplicationJson, MediaType.TextJavascript))
            .header(Header.userAgent(operaUserAgent))
            .header(Header.cacheControl(CacheDirective.NoCache))
            .header("accept-language", "en-GB,en-US")
            .header("referer", "https://www.flannels.com")
            .headers(config.headers)
            .get(uri"${config.baseUri}/api/productlist/v1/getforcategory?${args}")
            .response(asJson[FlannelsSearchResponse])
        }
      }
      .flatMap { r =>
        r.body match
          case Right(res) =>
            F.pure(res.products -> Option.when(res.products.nonEmpty)(page+1))
          case Left(DeserializationException(_, error)) if error.getMessage.contains("exhausted input") =>
            logger.warn(s"$name-search/exhausted input") >>
              F.sleep(3.second) >> getItems(sc)(page)
          case Left(DeserializationException(body, error)) =>
            logger.error(s"$name-search response parsing error: ${error.getMessage}\n$body") >>
              F.pure(Nil -> None)
          case Left(HttpError(_, s)) if s == StatusCode.Forbidden || s == StatusCode.TooManyRequests =>
            logger.error(s"$name-search/$s-critical") >>
              F.sleep(10.second) >> getItems(sc)(page)
          case Left(error) =>
            logger.warn(s"$name-search/error-${r.code.code}: ${error.getMessage}") >>
              F.sleep(5.second) >> getItems(sc)(page)
      }
}

object FlannelsClient:
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFlannelsClient[F](() => configProvider.flannels, backend, proxyBackend))