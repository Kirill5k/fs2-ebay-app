package ebayapp.core.clients.scan

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.scan.mappers.ScanItemMapper
import ebayapp.core.clients.scan.parsers.{ResponseParser, ScanItem}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{GenericStoreConfig, SearchCategory, SearchQuery}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream
import sttp.client3._
import sttp.model.StatusCode

import scala.concurrent.duration._

trait ScanClient[F[_]] extends SearchClient[F, ScanItem]

final private class LiveScanClient[F[_]](
    private val config: GenericStoreConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends ScanClient[F] {

  private val defaultHeaders: Map[String, String] = Map(
    "Connection"      -> "keep-alive",
    "Accept"          -> "*/*",
    "Accept-Encoding" -> "gzip, deflate, br",
    "Accept-Language" -> "en-GB,en-US;q=0.9,en;q=0.",
    "Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Cache-Control" -> "no-store, max-age=0",
    "User-Agent"    -> "Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",
    "Referer"       -> "https://www.scan.co.uk/",
    "Host"          -> "www.scan.co.uk",
    "Cookie" -> "DS=7UA2E7DW4nWCCWnSj+qXSXIYQrXEEhyyz0TtypCXft6u922fz2V0Qhcr8r1uQ+rfox/YR2xnFkZwFyWmf1dkyg==; S=iPpIiBa/N6Wv/v+5Ht06ObeHZ7Q9psRVSBQI14fQ1kgWuJ2AMavdRJGa4fFhxTGuXcdIb8E2+HtNBL2AFasxqg==; SID=XTt7G0yGt3+t5HGYcQ1Hog==; US=NNURMAkV2WaTR01Ihle72BzfdZu6rGv4UBNFQGNEqhJp+lwom4JA/bEqiCHPE2NimcDSyF5C44GRSBz9HX/mWTYz+0gnPAe8FVizYF/pYGAN97V1h6mYbZRtpdkCbhzaLrv2DuZhkpddEhjMyQwvd3h4+Y9elm2GnW/YV9Ao+bJevEGYlMSl7pnDVT6x8druzJE17ECrBYJWL8UJxDQcrOVtv4ZJeUd+PY+/XB4lw30Pxdu1UzPcFpGO+OotPix2f4YITq/MKd9granuMvUPGt24lGqsictSb0xGHXBG/Nj9rsiV525hWf0DFzzr829f; __cfduid=d683c6ad4693dbd39028eb7c1e1bb861f1619891621"
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
  ): F[ScanClient[F]] =
    Monad[F].pure(new LiveScanClient[F](config, backend))
}
