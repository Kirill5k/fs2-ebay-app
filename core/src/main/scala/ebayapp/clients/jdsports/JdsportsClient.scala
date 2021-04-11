package ebayapp.clients.jdsports

import cats.effect.{Sync, Timer}
import cats.implicits._
import ebayapp.clients.jdsports.mappers.JdsportsItemMapper
import ebayapp.clients.jdsports.parsers.{CatalogItem, ResponseParser}
import ebayapp.common.Logger
import ebayapp.common.config.{JdsportsConfig, SearchQuery}
import ebayapp.domain.{ItemDetails, ResellableItem}
import fs2.Stream
import sttp.client3.{SttpBackend, basicRequest}
import sttp.client3._

import scala.concurrent.duration._

trait JdsportsClient[F[_]] {
  def searchSale[D <: ItemDetails: JdsportsItemMapper](query: SearchQuery): Stream[F, ResellableItem[D]]
}

final private class LiveJdsportsClient[F[_]](
    private val config: JdsportsConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: Sync[F],
    T: Timer[F],
    logger: Logger[F]
) extends JdsportsClient[F] {

  private val defaultHeaders: Map[String, String] = Map(
    "User-Agent" -> "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
    "Referer"    -> "https://www.jdsports.co.uk/men/brand/"
  )

  override def searchSale[D <: ItemDetails: JdsportsItemMapper](query: SearchQuery): Stream[F, ResellableItem[D]] = ???

  private def searchByBrand(query: SearchQuery): F[List[CatalogItem]] =
    basicRequest
      .get(uri"${config.baseUri}/men/brand/${query.value.toLowerCase.replace(" ", "-")}/?max=408&sort=price-low-high")
      .headers(defaultHeaders)
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(html) =>
            F.fromEither(ResponseParser.parseSearchResponse(html))
          case Left(error) if r.code.isClientError || r.code.isServerError =>
            logger.error(s"error sending search request to selfridges: ${r.code}\n$error") *>
              F.pure(Nil)
          case Left(error) =>
            logger.warn(s"error sending search request to selfridges: ${error}") *>
              T.sleep(1.second) *> searchByBrand(query)
        }
      }

}
