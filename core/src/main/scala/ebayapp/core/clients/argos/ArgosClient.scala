package ebayapp.core.clients.argos

import cats.Monad
import cats.effect.{Temporal}
import cats.implicits._
import ebayapp.core.clients.argos.mappers.ArgosItemMapper
import ebayapp.core.clients.argos.responses.{ArgosSearchResponse, SearchData}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{ArgosConfig, SearchQuery}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
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

final private class LiveArgosClient[F[_]](
    private val config: ArgosConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    logger: Logger[F],
    timer: Temporal[F]
) extends ArgosClient[F] {

  override def findItem[D <: ItemDetails](query: SearchQuery)(implicit
      mapper: ArgosItemMapper[D]
  ): Stream[F, ResellableItem[D]] =
    Stream
      .unfoldLoopEval(1) { page =>
        search(query, page).map {
          case Some(res) => (res.response.data, res.response.meta.nextPage)
          case None      => (Nil, None)
        }
      }
      .flatMap(Stream.emits)
      .filter(_.attributes.relevancyRank == 1)
      .filter(i => i.attributes.deliverable || i.attributes.reservable)
      .map(mapper.toDomain)

  private def search(query: SearchQuery, page: Int): F[Option[SearchData]] =
    basicRequest
      .get(
        uri"${config.baseUri}/finder-api/product;isSearch=true;queryParams={%22page%22:%22$page%22,%22templateType%22:null};searchTerm=${query.value};searchType=null?returnMeta=true"
      )
      .response(asJson[ArgosSearchResponse])
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(response) => response.data.some.pure[F]
          case Left(DeserializationException(body, error)) =>
            logger.error(s"argos-search response parsing error: ${error.getMessage}, \n$body") *>
              none[SearchData].pure[F]
          case Left(HttpError(body, status)) if status.isClientError || status.isServerError =>
            logger.error(s"argos-search/$status-error, \n$body") *>
              none[SearchData].pure[F]
          case Left(error) =>
            logger.error(s"argos-search/error: ${error.getMessage}\n$error") *>
              timer.sleep(1.second) *> search(query, page)
        }
      }
}

object ArgosClient {
  def make[F[_]: Temporal: Logger](
      config: ArgosConfig,
      backend: SttpBackend[F, Any]
  ): F[ArgosClient[F]] =
    Monad[F].pure(new LiveArgosClient[F](config, backend))
}
