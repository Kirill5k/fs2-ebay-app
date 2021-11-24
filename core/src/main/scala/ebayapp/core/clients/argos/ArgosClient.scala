package ebayapp.core.clients.argos

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap._
import cats.syntax.applicative._
import cats.syntax.option._
import cats.syntax.apply._
import cats.syntax.functor._
import ebayapp.core.clients.{HttpClient, SearchClient, SearchCriteria}
import ebayapp.core.clients.argos.mappers.argosGenericItemMapper
import ebayapp.core.clients.argos.responses.{ArgosSearchResponse, SearchData}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import io.circe.generic.auto._
import sttp.client3._
import sttp.client3.circe.asJson
import fs2.Stream

import scala.concurrent.duration._

final private class LiveArgosClient[F[_]](
    private val config: GenericRetailerConfig,
    override val backend: SttpBackend[F, Any]
)(implicit
    logger: Logger[F],
    timer: Temporal[F]
) extends SearchClient[F] with HttpClient[F] {

  override val name   = "argos"
  private val headers = defaultHeaders ++ config.headers.getOrElse(Map.empty)

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] =
    Stream
      .unfoldLoopEval(1) { page =>
        search(criteria.query, page).map {
          case Some(res) => (res.response.data, res.response.meta.nextPage)
          case None      => (Nil, None)
        }
      }
      .flatMap(Stream.emits)
      .filter(_.attributes.relevancyRank == 1)
      .filter(i => i.attributes.deliverable || i.attributes.reservable)
      .map(argosGenericItemMapper.toDomain)

  private def search(query: String, page: Int): F[Option[SearchData]] =
    dispatch() {
      basicRequest
        .get(
          uri"${config.baseUri}/finder-api/product;isSearch=true;queryParams={%22page%22:%22$page%22,%22templateType%22:null};searchTerm=${query};searchType=null?returnMeta=true"
        )
        .headers(headers)
        .response(asJson[ArgosSearchResponse])
    }.flatMap { r =>
      r.body match {
        case Right(response) => response.data.some.pure[F]
        case Left(DeserializationException(body, error)) =>
          logger.error(s"$name-search response parsing error: ${error.getMessage}, \n$body") *>
            none[SearchData].pure[F]
        case Left(HttpError(body, status)) if status.isClientError || status.isServerError =>
          logger.error(s"$name-search/$status-error\n$body") *>
            none[SearchData].pure[F]
        case Left(error) =>
          logger.error(s"$name-search/error: ${error.getMessage}\n$error") *>
            timer.sleep(1.second) *> search(query, page)
      }
    }
}

object ArgosClient {
  def make[F[_]: Temporal: Logger](
      config: GenericRetailerConfig,
      backend: SttpBackend[F, Any]
  ): F[SearchClient[F]] =
    Monad[F].pure(new LiveArgosClient[F](config, backend))
}
