package ebayapp.core.clients.jd

import cats.Monad
import cats.effect.Temporal
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.CurlImpersonateClient.RetrySpec
import ebayapp.core.clients.{CurlImpersonateClient, SearchClient}
import ebayapp.core.clients.jd.mappers.{JdsportsItem, JdsportsItemMapper}
import ebayapp.core.clients.jd.requests.JdAlgoliaSearchRequest
import ebayapp.core.clients.jd.responses.{JdAlgoliaProduct, JdAlgoliaSearchResponse}
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.Retailer
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import io.circe.parser.decode
import io.circe.syntax.*
import sttp.client4.UriContext
import sttp.model.{HeaderNames, StatusCode}

import java.util.Locale
import scala.concurrent.duration.*

final private[jd] class JdAlgoliaClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val client: CurlImpersonateClient[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] {

  private val name    = "jdsports-algolia"
  private val website = "https://www.jdsports.co.uk"

  private val retrySpec = RetrySpec.Default.copy(
    retryExcludedCodes = (400 to 499).filterNot(_ == StatusCode.TooManyRequests.code).map(StatusCode(_)).toSet
  )

  private def requestHeaders(config: GenericRetailerConfig): Map[String, String] = {
    val defaults = Map(
      HeaderNames.ContentType -> "application/json",
      HeaderNames.Accept      -> "application/json",
      HeaderNames.Origin      -> website,
      HeaderNames.Referer     -> s"$website/"
    )
    defaults.filterNot((key, _) => config.headers.keysIterator.exists(_.equalsIgnoreCase(key))) ++ config.headers
  }

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .unfoldLoopEval(0)(searchPage(criteria))
      .flatMap(Stream.emits)
      .filter(p => p.inStock && p.isOnSale)
      .filter(p => criteria.category.forall(c => p.rootCategories.exists(_.equalsIgnoreCase(c.trim))))
      .flatMap { product =>
        val category = product.rootCategories
          .find(c => criteria.category.forall(_.trim.equalsIgnoreCase(c)))
          .getOrElse("")
          .toLowerCase(Locale.ROOT)
        val items = for
          brand <- product.brand.getOrElse(Nil).headOption.map(_.trim).filter(_.nonEmpty).toList
          size  <- product.size.getOrElse(Nil).map(_.trim).filter(_.nonEmpty)
        yield JdsportsItem(
          id = product.objectID,
          name = product.name,
          currentPrice = product.price,
          previousPrice = product.wasPrice,
          brand = brand,
          colour = product.colour.getOrElse(""),
          size = size,
          image = product.cleanImageUrl,
          category = category,
          storeUrl = website,
          storeName = Retailer.Jdsports.name,
          slug = Some(product.slug)
        )
        Stream.emits(items)
      }
      .map(JdsportsItemMapper.clothing.toDomain(criteria))

  private def searchPage(criteria: SearchCriteria)(page: Int): F[(List[JdAlgoliaProduct], Option[Int])] =
    configProvider()
      .flatMap { config =>
        val base            = config.uri.stripSuffix("/")
        val queryParameters = config.queryParameters.getOrElse(Map.empty)
        val url             = uri"$base/1/indexes/jd_prod_products_en/query?$queryParameters".toString
        val body            = JdAlgoliaSearchRequest(criteria.query, page).asJson.noSpaces
        val delay           = if page == 0 then F.unit else F.sleep(config.delayBetweenIndividualRequests.getOrElse(Duration.Zero))
        delay *> client.post(url, requestHeaders(config), body, retrySpec)
      }
      .flatMap { (code, body) =>
        if code.isSuccess then
          F.fromEither(decode[JdAlgoliaSearchResponse](body)).map { response =>
            response.hits -> Option.when(response.hits.nonEmpty && page + 1 < response.nbPages)(page + 1)
          }
        else logger.error(s"$name-search/$code-${criteria.query}") *> F.pure(Nil -> None)
      }
      .handleErrorWith { error =>
        logger.error(s"$name-search/error for ${criteria.query}: ${error.getMessage}") *> F.pure(Nil -> None)
      }
}

object JdClient:
  def jdsports[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(JdAlgoliaClient[F](() => configProvider.jdsports, client))
