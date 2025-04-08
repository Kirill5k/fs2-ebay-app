package ebayapp.core.clients.scan

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.apply.*
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.clients.scan.mappers.ScanItemMapper
import ebayapp.core.clients.scan.parsers.{ResponseParser, ScanItem}
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.client3.*
import sttp.model.StatusCode

import scala.concurrent.duration.*

final private class LiveScanClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val httpBackend: SttpBackend[F, Any],
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "scan"

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(F.fromOption(criteria.category, new IllegalArgumentException("Category is required")))
      .flatMap { cat =>
        Stream
          .evalSeq(searchByCard(criteria.query, cat))
          .map(ScanItemMapper.generic.toDomain(criteria))
      }

  private def searchByCard(query: String, category: String): F[List[ScanItem]] =
    configProvider()
      .flatMap { config =>
        dispatch {
          val cat  = category.toLowerCase.replaceAll(" ", "-")
          val card = query.toLowerCase.replaceAll(" ", "-")
          emptyRequest
            .get(uri"${config.baseUri}/shop/gaming/$cat/$card#filter=1&inStock=1")
            .headers(defaultHeaders ++ config.headers)
        }
      }
      .flatMap { r =>
        r.body match
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(_) if r.code == StatusCode.Forbidden =>
            logger.error(s"$name-search/forbidden") *> F.sleep(30.seconds) *> searchByCard(query, category)
          case Left(_) if r.code == StatusCode.NotFound =>
            logger.error(s"$name-search/404") *> F.pure(Nil)
          case Left(_) if r.code.isClientError =>
            logger.error(s"$name-search/${r.code}-error") *> F.pure(Nil)
          case Left(_) if r.code.isServerError =>
            logger.warn(s"$name-search/${r.code}-repeatable") *>
              F.sleep(3.second) *> searchByCard(query, category)
          case Left(error) =>
            logger.error(s"$name-search/error: $error") *>
              F.sleep(3.second) *> searchByCard(query, category)
      }
}

object ScanClient:
  def make[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      backend: SttpBackend[F, Any],
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveScanClient[F](() => configProvider.scan, backend))
