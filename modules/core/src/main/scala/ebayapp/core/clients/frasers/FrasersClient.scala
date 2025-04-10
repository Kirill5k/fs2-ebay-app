package ebayapp.core.clients.frasers

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import ebayapp.core.clients.frasers.mappers.{FrasersItem, FrasersItemMapper}
import ebayapp.core.clients.frasers.responses.{FlannelsProduct, FlannelsSearchResponse}
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.{ResellableItem, Retailer}
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.client3.*
import sttp.client3.circe.asJson
import sttp.model.headers.CacheDirective
import sttp.model.{Header, MediaType, StatusCode}

import scala.concurrent.duration.*

final private class LiveFrasersClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val httpBackend: SttpBackend[F, Any],
    private val retailer: Retailer.Flannels.type | Retailer.Tessuti.type | Retailer.Scotts.type
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = retailer.name

  private val groupIdPrefix: String = retailer match
    case Retailer.Flannels => "FLAN_BRA"
    case Retailer.Tessuti  => "TESS_BRA"
    case Retailer.Scotts   => "SCOT_BRA"

  private val categoryFiltersKey: String = retailer match
    case Retailer.Flannels => "AFLOR"
    case Retailer.Tessuti  => "390_4098650"
    case Retailer.Scotts   => "390_4098464"

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
            Stream.emits(product.sizes.split(", ").toList.map(s => FrasersItem(product, s, config.websiteUri, name)))
          }
          .map(FrasersItemMapper.clothing.toDomain(criteria))
      }

  private def getItems(sc: SearchCriteria)(page: Int = 1): F[(List[FlannelsProduct], Option[Int])] =
    configProvider()
      .flatMap { config =>
        val args = Map(
          "categoryId"       -> s"${groupIdPrefix}${sc.query.toUpperCase.replaceAll("[ -]", "")}",
          "page"             -> page.toString,
          "productsPerPage"  -> "100",
          "sortOption"       -> "discountvalue_desc",
          "isSearch"         -> "false",
          "clearFilters"     -> "false",
          "selectedCurrency" -> "GBP",
          "selectedFilters"  -> sc.formattedCategory
        )
        dispatch {
          emptyRequest
            .maxRedirects(0)
            .acceptEncoding(acceptAnything)
            .header(Header.accept(MediaType.ApplicationJson, MediaType.TextJavascript))
            .header(Header.userAgent(operaUserAgent))
            .header(Header.cacheControl(CacheDirective.NoCache))
            .header("accept-language", "en-GB,en-US")
            .header("referer", config.websiteUri)
            .headers(config.headers)
            .get(uri"${config.uri}/api/productlist/v1/getforcategory?${args}")
            .response(asJson[FlannelsSearchResponse])
        }
      }
      .flatMap { r =>
        r.body match
          case Right(res) =>
            F.pure(res.products -> Option.when(res.products.nonEmpty)(page + 1))
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

  extension (cs: SearchCriteria)
    def formattedCategory: String =
      cs.category match
        case Some(c) => s"$categoryFiltersKey^${c.toLowerCase.capitalize}"
        case None    => ""
}

object FrasersClient:
  def flannels[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFrasersClient[F](() => configProvider.flannels, backend, Retailer.Flannels))

  def tessuti[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFrasersClient[F](() => configProvider.tessuti, backend, Retailer.Tessuti))

  def scotts[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFrasersClient[F](() => configProvider.scotts, backend, Retailer.Scotts))
