package ebayapp.core.clients.scan

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.scan.mappers.ScanItemMapper
import ebayapp.core.clients.scan.parsers.{ResponseParser, ScanItem}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{ScanConfig, SearchCategory, SearchQuery}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream
import sttp.client3._
import sttp.model.StatusCode

import scala.concurrent.duration._

trait ScanClient[F[_]] {
  def search[D <: ItemDetails: ScanItemMapper](
      query: SearchQuery,
      category: Option[SearchCategory]
  ): Stream[F, ResellableItem[D]]
}

final private class LiveScanClient[F[_]](
    private val config: ScanConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends ScanClient[F] {

  private val defaultHeaders: Map[String, String] = Map(
    "Connection"      -> "keep-alive",
    "Accept"          -> "*/*",
    "Accept-Encoding" -> "gzip, deflate, br",
    "Cache-Control"   -> "no-store, max-age=0",
    "User-Agent"      -> "Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",
    "Referer"         -> "https://www.scan.co.uk/"
  )

  override def search[D <: ItemDetails](
      query: SearchQuery,
      category: Option[SearchCategory]
  )(implicit
      mapper: ScanItemMapper[D]
  ): Stream[F, ResellableItem[D]] =
    Stream
      .evalSeq(searchByCard(query, category.get))
      .map(mapper.toDomain)

  private def searchByCard(query: SearchQuery, category: SearchCategory): F[List[ScanItem]] = {
    val cat  = category.value.toLowerCase.replaceAll(" ", "-")
    val card = query.value.toLowerCase.replaceAll(" ", "-")
    basicRequest
      .get(uri"${config.baseUri}/shop/gaming/$cat/$card")
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(_) if r.code == StatusCode.Forbidden =>
            logger.error(s"scan-search/forbidden") *>
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
      config: ScanConfig,
      backend: SttpBackend[F, Any]
  ): F[ScanClient[F]] =
    Monad[F].pure(new LiveScanClient[F](config, backend))
}
