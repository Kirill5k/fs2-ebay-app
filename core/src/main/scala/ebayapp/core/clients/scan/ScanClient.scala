package ebayapp.core.clients.scan

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.scan.mappers.scanaGenericItemMapper
import ebayapp.core.clients.scan.parsers.{ResponseParser, ScanItem}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{GenericStoreConfig, SearchCategory, SearchQuery}
import ebayapp.core.domain.{ResellableItem}
import fs2.Stream
import sttp.client3._
import sttp.model.StatusCode

import scala.concurrent.duration._

final private class LiveScanClient[F[_]](
    private val config: GenericStoreConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] {

  private val headers: Map[String, String] = defaultHeaders ++ config.headers

  override def search(
      query: SearchQuery,
      category: Option[SearchCategory]
  ): Stream[F, ResellableItem.Anything] =
    Stream
      .evalSeq(searchByCard(query, category.get))
      .map(scanaGenericItemMapper.toDomain)

  private def searchByCard(query: SearchQuery, category: SearchCategory): F[List[ScanItem]] = {
    val cat  = category.value.toLowerCase.replaceAll(" ", "-")
    val card = query.value.toLowerCase.replaceAll(" ", "-")
    basicRequest
      .get(uri"${config.baseUri}/shop/gaming/$cat/$card")
      .headers(headers)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(html) if r.code == StatusCode.Forbidden =>
            logger.error(s"scan-search/forbidden\n$html") *>
              F.sleep(30.seconds) *> searchByCard(query, category)
          case Left(_) if r.code == StatusCode.NotFound =>
            logger.error(s"scan-search/404") *>
              F.pure(Nil)
          case Left(_) if r.code.isClientError =>
            logger.error(s"scan-search/${r.code}-error") *>
              F.pure(Nil)
          case Left(_) if r.code.isServerError =>
            logger.warn(s"scan-search/${r.code}-repeatable") *>
              F.sleep(3.second) *> searchByCard(query, category)
          case Left(error) =>
            logger.error(s"scan-search/error: $error") *>
              F.sleep(3.second) *> searchByCard(query, category)
        }
      }
  }
}

object ScanClient {
  def make[F[_]: Temporal: Logger](
      config: GenericStoreConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveScanClient[F](config, backend))
}
