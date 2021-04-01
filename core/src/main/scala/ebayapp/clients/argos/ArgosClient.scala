package ebayapp.clients.argos

import cats.effect.{Sync, Timer}
import cats.implicits._
import ebayapp.clients.argos.mappers.ArgosItemMapper
import ebayapp.clients.argos.responses.{ArgosSearchResponse, SearchData}
import ebayapp.common.Logger
import ebayapp.common.config.{ArgosConfig, SearchQuery}
import ebayapp.domain.{ItemDetails, ResellableItem}
import io.circe.generic.auto._
import sttp.client3._
import sttp.client3.circe.asJson
import fs2.Stream

import scala.concurrent.duration._

trait ArgosClient[F[_]] {
  def findItem[D <: ItemDetails](query: SearchQuery)(implicit
      mapper: ArgosItemMapper[D]
  ): Stream[F, ResellableItem[D]]
}

final private class LiveArgosClient[F[_]: Sync](
     private val config: ArgosConfig,
     private val backend: SttpBackend[F, Any]
)(implicit
  logger: Logger[F],
  timer: Timer[F]
) extends ArgosClient[F] {

  override def findItem[D <: ItemDetails](query: SearchQuery)(implicit
      mapper: ArgosItemMapper[D]
  ): Stream[F, ResellableItem[D]] =
    Stream.unfoldLoopEval(1) { page =>
      search(query, page).map {
        case Some(res) => (res.response.data, res.response.meta.nextPage)
        case None =>(Nil, None)
      }
    }
      .flatMap(Stream.emits)
      .filter(_.attributes.relevancyRank == 1)
      .filter(i => i.attributes.deliverable || i.attributes.reservable)
      .map(mapper.toDomain)

  private def search(query: SearchQuery, page: Int): F[Option[SearchData]] =
    basicRequest
      .get(uri"${config.baseUri}/finder-api/product;isSearch=true;queryParams={%22page%22:%22$page%22,%22templateType%22:null};searchTerm=${query.value};searchType=null?returnMeta=true")
      .response(asJson[ArgosSearchResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(response) => response.data.some.pure[F]
          case Left(DeserializationException(body, error)) =>
            logger.error(s"error parsing argos search response: ${error.getMessage}, \n$body") *>
              none[SearchData].pure[F]
          case Left(HttpError(body, status)) if status.isClientError || status.isServerError =>
            logger.error(s"error sending search request to argos: $status, \n$body") *>
              none[SearchData].pure[F]
          case Left(error) =>
            logger.warn(s"error sending search request to argos: ${error.getMessage}") *>
              timer.sleep(1.second) *> search(query, page)
        }
      }
}

object ArgosClient {
  def make[F[_]: Sync: Logger: Timer](
      config: ArgosConfig,
      backend: SttpBackend[F, Any]
  ): F[ArgosClient[F]] =
    Sync[F].delay(new LiveArgosClient[F](config, backend))
}
