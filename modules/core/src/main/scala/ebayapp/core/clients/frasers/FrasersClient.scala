package ebayapp.core.clients.frasers

import cats.Monad
import cats.effect.Temporal
import cats.syntax.applicativeError.*
import cats.syntax.flatMap.*
import ebayapp.core.clients.frasers.mappers.{FrasersItem, FrasersItemMapper}
import ebayapp.core.clients.frasers.responses.{FlannelsProduct, FlannelsSearchResponse}
import ebayapp.core.clients.{CurlImpersonateClient, SearchClient}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.{ResellableItem, Retailer}
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import io.circe.parser.decode
import sttp.model.{HeaderNames, StatusCode}

import java.net.URLEncoder
import scala.concurrent.duration.*

final private class LiveFrasersClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val retailer: Retailer.Flannels.type | Retailer.Tessuti.type | Retailer.Scotts.type,
    private val client: CurlImpersonateClient[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] {

  private val name: String = retailer.name

  private val groupIdPrefix: String = retailer match
    case Retailer.Flannels => "FLAN_BRA"
    case Retailer.Tessuti  => "TESS_BRA"
    case Retailer.Scotts   => "SCOT_BRA"

  private val categoryFiltersKey: String = retailer match
    case Retailer.Flannels => "AFLOR"
    case Retailer.Tessuti  => "390_4098650"
    case Retailer.Scotts   => "390_4098464"

  private val retrySpec = CurlImpersonateClient.RetrySpec(
    retryOnClientError = true,
    retryOnServerError = true,
    retryExcludedCodes = Set(StatusCode.NotFound),
    retryOnConnectionError = true,
    maxRetries = 3,
    maxDelay = 1.minute
  )

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

  private def getItems(sc: SearchCriteria)(page: Int): F[(List[FlannelsProduct], Option[Int])] =
    configProvider()
      .flatMap { config =>
        val args = List(
          "categoryId"       -> s"${groupIdPrefix}${sc.query.toUpperCase.replaceAll("[ -]", "")}",
          "page"             -> page.toString,
          "productsPerPage"  -> "100",
          "sortOption"       -> "discountvalue_desc",
          "isSearch"         -> "false",
          "clearFilters"     -> "false",
          "selectedCurrency" -> "GBP",
          "selectedFilters"  -> sc.formattedCategory
        )
        val queryString = args.map((k, v) => s"$k=${URLEncoder.encode(v, "UTF-8")}").mkString("&")
        val url         = s"${config.uri}/api/productlist/v1/getforcategory?$queryString"
        val headers     = Map(
          HeaderNames.Accept  -> "application/json, text/javascript",
          HeaderNames.Referer -> config.websiteUri
        ) ++ config.headers
        client.get(url, headers, retrySpec)
      }
      .flatMap { (code, body) =>
        if code.isSuccess then
          decode[FlannelsSearchResponse](body) match
            case Right(res) =>
              F.pure(res.products -> Option.when(res.products.nonEmpty)(page + 1))
            case Left(error) if error.getMessage.contains("exhausted input") =>
              logger.warn(s"$name-search/exhausted input") >>
                F.sleep(3.second) >> getItems(sc)(page)
            case Left(error) =>
              logger.error(s"$name-search response parsing error: ${error.getMessage}\n$body") >>
                F.pure(Nil -> None)
        else
          logger.error(s"$name-search/$code-critical") >>
            F.pure(Nil -> None)
      }.handleErrorWith { error =>
        logger.error(s"$name-search/error: ${error.getMessage}") >>
          F.pure(Nil -> None)
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
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFrasersClient[F](() => configProvider.flannels, Retailer.Flannels, client))

  def tessuti[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFrasersClient[F](() => configProvider.tessuti, Retailer.Tessuti, client))

  def scotts[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFrasersClient[F](() => configProvider.scotts, Retailer.Scotts, client))
