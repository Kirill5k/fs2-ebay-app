package ebayapp.core.clients.frasers

import cats.Monad
import cats.effect.Temporal
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.frasers.mappers.{FrasersItem, FrasersItemMapper}
import ebayapp.core.clients.frasers.parsers.ResponseParser
import ebayapp.core.clients.frasers.responses.FrasersProduct
import ebayapp.core.clients.{CurlImpersonateClient, SearchClient}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.{ResellableItem, Retailer}
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import kirill5k.common.cats.syntax.stream.*
import sttp.model.StatusCode

import scala.concurrent.duration.*

final private class LiveFrasersClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val retailer: Retailer.Flannels.type,
    private val client: CurlImpersonateClient[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] {

  private val name: String = retailer.name

  private val retrySpec = CurlImpersonateClient.RetrySpec(
    retryOnClientError = true,
    retryOnServerError = true,
    retryExcludedCodes = Set(StatusCode.NotFound),
    retryOnConnectionError = true,
    maxRetries = 3,
    maxDelay = 1.minute
  )

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream.eval(configProvider()).flatMap { config =>
      Stream
        .unfoldLoopEval(1)(getItems(criteria))
        .flatMap(Stream.emits)
        .filter(_.isOnSale)
        .flatMap { product =>
          Stream.emits(product.sizeVariants.map(sv => FrasersItem(product, sv.description, config.websiteUri, name)))
        }
        .map(FrasersItemMapper.clothing.toDomain(criteria))
        .handleErrorWith(e => Stream.logError(e)(e.getMessage))
    }

  private def getItems(sc: SearchCriteria)(page: Int): F[(List[FrasersProduct], Option[Int])] =
    configProvider()
      .flatMap { config =>
        val brand    = sc.query.toLowerCase.replace(" ", "-")
        val category = sc.category.fold("")(c => s"/$c")
        val url      = s"${config.websiteUri}/$brand$category?sort=DISCOUNT_PERCENTAGE&sortDirection=DESC&dcp=$page"
        client.get(url, config.headers, retrySpec)
      }
      .flatMap { (code, body) =>
        if code.isSuccess then {
          for
            activePage <- F.fromEither(ResponseParser.parseActivePageNumberFromBrandPageResponse(body))
            products   <- F.fromEither(ResponseParser.parseItemsFromBrandPageResponse(body))
            noMoreItems = activePage != page
          yield if (noMoreItems) Nil -> None else products -> Some(page + 1)
        } else logger.error(s"$name-search/$code-${sc.query}") *> F.pure(Nil -> None)
      }
      .handleErrorWith { e =>
        logger.error(s"$name-search/error: ${e.getMessage}") *> F.pure(Nil -> None)
      }
}

object FrasersClient:
  def flannels[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFrasersClient[F](() => configProvider.flannels, Retailer.Flannels, client))
