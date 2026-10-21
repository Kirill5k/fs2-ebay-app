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
import ebayapp.core.clients.jd.parsers.{JdCatalogItem, JdProduct, ResponseParser}
import ebayapp.core.clients.jd.requests.JdAlgoliaSearchRequest
import ebayapp.core.clients.jd.responses.{JdAlgoliaProduct, JdAlgoliaSearchResponse}
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.Retailer
import kirill5k.common.cats.syntax.stream.*
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import io.circe.parser.decode
import io.circe.syntax.*
import sttp.client4.UriContext
import sttp.model.{HeaderNames, StatusCode}

import java.util.Locale
import scala.concurrent.duration.*

final private class CurlImpersonateJdClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val retailer: Retailer.Jdsports.type,
    private val client: CurlImpersonateClient[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] {

  private val name: String = retailer.name
  private val stepSize     = 50

  private val searchRetrySpec = RetrySpec.Default.copy(
    retryExcludedCodes = Set(StatusCode.NotFound),
    maxRetries = 3,
    maxDelay = 10.minutes
  )

  private val stockRetrySpec = RetrySpec.Default.copy(
    retryExcludedCodes = Set(StatusCode.NotFound),
    maxRetries = 3,
    maxDelay = 5.minutes
  )

  private def randomDelay(config: GenericRetailerConfig): FiniteDuration =
    config.delayBetweenIndividualRequests
      .map(d => (d.toMillis + scala.util.Random.nextInt(3000)).millis)
      .getOrElse((3000 + scala.util.Random.nextInt(5000)).millis)

  private def requestHeaders(config: GenericRetailerConfig, referer: String): Map[String, String] =
    Map(
      HeaderNames.Origin  -> config.websiteUri,
      HeaderNames.Referer -> referer,
      "X-Requested-With"  -> "XMLHttpRequest"
    ) ++ config.headers

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream.eval(configProvider()).flatMap { config =>
      brandItems(criteria)
        .filter(_.sale)
        .evalTap(_ => F.sleep(randomDelay(config)))
        .evalMap(i => getProductStock(i))
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
              p.details.cleanImageUrl,
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
        searchByBrand(criteria, step)
          .map(items => items -> Option.when(items.size == stepSize)(step + 1))
      }
      .flatMap(Stream.emits)

  private def searchByBrand(criteria: SearchCriteria, step: Int): F[List[JdCatalogItem]] =
    configProvider()
      .flatMap { config =>
        val base  = config.uri + criteria.category.fold("")(c => s"/$c")
        val brand = criteria.query.toLowerCase.replace(" ", "-")
        val url   = s"$base/brand/$brand/?max=$stepSize&from=${step * stepSize}&sort=price-low-high&AJAX=1"
        client.get(url, requestHeaders(config, s"${config.websiteUri}/brand/$brand?from=${step * stepSize}"), searchRetrySpec)
      }
      .flatMap { (code, body) =>
        code match {
          case s if s.isSuccess =>
            F.fromEither(ResponseParser.parseBrandAjaxResponse(body))
          case StatusCode.NotFound if step == 0 =>
            logger.warn(s"$name-search/404") *> F.pure(Nil)
          case StatusCode.NotFound =>
            F.pure(Nil)
          case _ =>
            logger.error(s"$name-search/$code-${criteria.query}\n$body") *> F.pure(Nil)
        }
      }
      .handleErrorWith { e =>
        logger.error(s"$name-search/exception: ${e.getMessage}") *> F.pure(Nil)
      }

  private def getProductStock(ci: JdCatalogItem): F[Option[JdProduct]] =
    configProvider()
      .flatMap { config =>
        val url = s"${config.uri}/product/${ci.fullName}/${ci.plu}/stock/"
        client.get(url, requestHeaders(config, s"${config.websiteUri}/product/${ci.fullName}/${ci.plu}/"), stockRetrySpec)
      }
      .flatMap { (code, body) =>
        code match {
          case s if s.isSuccess =>
            F.fromEither(ResponseParser.parseProductStockResponse(body))
          case StatusCode.NotFound =>
            logger.warn(s"$name-get-stock/404") *> F.pure(None)
          case _ =>
            logger.error(s"$name-get-stock/$code-${ci.fullName}\n$body") *> F.pure(None)
        }
      }
      .handleErrorWith { e =>
        logger.error(s"$name-get-stock/exception: ${e.getMessage}") *> F.pure(None)
      }
}

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
          image = product.image,
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
  def jdsportsAlgolia[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(JdAlgoliaClient[F](() => configProvider.jdsports, client))

  def jdsports[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(CurlImpersonateJdClient[F](() => configProvider.jdsports, Retailer.Jdsports, client))
