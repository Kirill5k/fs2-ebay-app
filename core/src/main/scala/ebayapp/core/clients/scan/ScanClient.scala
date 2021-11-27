package ebayapp.core.clients.scan

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap._
import cats.syntax.apply._
import ebayapp.core.clients.{HttpClient, SearchClient, SearchCriteria}
import ebayapp.core.clients.scan.mappers.scanaGenericItemMapper
import ebayapp.core.clients.scan.parsers.{ResponseParser, ScanItem}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import fs2.Stream
import sttp.client3._
import sttp.model.StatusCode

import scala.concurrent.duration._

final private class LiveScanClient[F[_]](
    private val config: GenericRetailerConfig,
    override val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "scan"

  private val headers: Map[String, String] = defaultHeaders ++ config.headers

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .eval(F.fromOption(criteria.category, new IllegalArgumentException("Category is required")))
      .flatMap { cat =>
        Stream
          .evalSeq(searchByCard(criteria.query, cat))
          .map(scanaGenericItemMapper.toDomain)
      }

  private def searchByCard(query: String, category: String): F[List[ScanItem]] =
    dispatch() {
      val cat  = category.toLowerCase.replaceAll(" ", "-")
      val card = query.toLowerCase.replaceAll(" ", "-")
      basicRequest
        .get(uri"${config.baseUri}/shop/gaming/$cat/$card#filter=1&inStock=1")
        .headers(headers)
    }.flatMap { r =>
      r.body match {
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
}

object ScanClient {
  def make[F[_]: Temporal: Logger](
      config: GenericRetailerConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveScanClient[F](config, backend))
}
