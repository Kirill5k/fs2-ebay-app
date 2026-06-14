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
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.Retailer
import kirill5k.common.cats.syntax.stream.*
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.model.{HeaderNames, StatusCode}

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
            logger.error(s"$name-search/$code-${criteria.query}") *> F.pure(Nil)
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
            logger.error(s"$name-get-stock/$code-${ci.fullName}") *> F.pure(None)
        }
      }
      .handleErrorWith { e =>
        logger.error(s"$name-get-stock/exception: ${e.getMessage}") *> F.pure(None)
      }
}

object JdClient:
  def jdsports[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(CurlImpersonateJdClient[F](() => configProvider.jdsports, Retailer.Jdsports, client))
