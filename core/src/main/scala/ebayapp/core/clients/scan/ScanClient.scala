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
    "Accept-Language" -> "en-GB,en-US;q=0.9,en;q=0.",
    "Accept"          -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Cache-Control"   -> "no-store, max-age=0",
    "User-Agent"      -> "Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",
    "Referer"         -> "https://www.scan.co.uk/search?q=radeon+rx/",
    "Cookie"          -> "__cfduid=d724efef1efdd731a0efab53d84eed88c1619626366; S=cml7KVdW6P8tmZweCiTBNUMNx3uT4wA2FJVulViuMONtnN+gYhvYE4yRcMG9TYG8xVD8qHtEtz3adBDQJZhSSg==; US=NNURMAkV2WaTR01Ihle72BzfdZu6rGv4UBNFQGNEqhLSMul5Xr0IXiRMgMv2BpvEtnnk3OPRUSlnlU0LtKkrrDYz+0gnPAe8FVizYF/pYGAN97V1h6mYbZRtpdkCbhzaLrv2DuZhkpddEhjMyQwvd3h4+Y9elm2GnW/YV9Ao+bJevEGYlMSl7pnDVT6x8druzJE17ECrBYJWL8UJxDQcrOVtv4ZJeUd+PY+/XB4lw30Pxdu1UzPcFpGO+OotPix2h9oXIZsIr7fXTdLK7unuqCmpIFpDoy6wYhlekq1SAV/quIwqNxZNIoVHp0w8AmNo; DS=r3o955tebZl6Oe/qdlX/HmFPE5zs9OgqCyDnD6kJqISrIuVDU+G+jhWEkeot4i9Z4pkTxZgeUF0S3Jqq8uVSxQ==; R=+G2uYbvgZ5520B9rCrqgyJBbzdCxWlSetyTiKh/ScjAngPs+CD7uI3GpNG+3piRqCVPXrlwa+Yc22D++z5kgI0Hk1AI7TWtt8I/AU15Zi3RzmdzGdOfAlh3bIU5eX1ZSiYr9+6H86MY/ntLCUG23eA==; BVImplmain_site=0758; cf_clearance=870e1c00707e4a7635eb42b4d1f5f75201966a74-1619626724-0-150; cookpol=3; SID=XTt7G0yGt3+t5HGYcQ1Hog==; PL=oL/YgxH9hdxZmwCinZiL00Fj6Gw9Rf8GhMii/fpemXpsv3vEuhN/G8OeBgztdJ/07F7PgcEcOXfOEop04pf8OQ=="
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
      config: ScanConfig,
      backend: SttpBackend[F, Any]
  ): F[ScanClient[F]] =
    Monad[F].pure(new LiveScanClient[F](config, backend))
}
