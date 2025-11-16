package ebayapp.core.clients.argos

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.applicative.*
import cats.syntax.option.*
import cats.syntax.apply.*
import cats.syntax.functor.*
import ebayapp.core.clients.{Fs2HttpClient, SearchClient}
import ebayapp.core.clients.argos.mappers.ArgosItemMapper
import ebayapp.core.clients.argos.responses.{ArgosSearchResponse, SearchData}
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.*
import sttp.client4.circe.asJson
import fs2.Stream

import scala.concurrent.duration.*

final private class LiveArgosClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]]
)(using
    logger: Logger[F],
    timer: Temporal[F]
) extends SearchClient[F] with Fs2HttpClient[F] {

  override val name = "argos"

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
      .map(ArgosItemMapper.generic.toDomain(criteria))

  private def search(query: String, page: Int): F[Option[SearchData]] =
    configProvider()
      .flatMap { config =>
        dispatch {
          val uri =
            uri"${config.baseUri}/finder-api/product;isSearch=true;queryParams={%22page%22:%22$page%22,%22templateType%22:null};searchTerm=${query};searchType=null?returnMeta=true"
          basicRequest
            .get(uri)
            .headers(defaultHeaders ++ config.headers)
            .response(asJson[ArgosSearchResponse])
        }
      }
      .flatMap { r =>
        r.body match {
          case Right(response)                                                  => response.data.some.pure[F]
          case Left(ResponseException.DeserializationException(body, error, _)) =>
            logger.error(s"$name-search response parsing error: ${error.getMessage}, \n$body") *>
              none[SearchData].pure[F]
          case Left(ResponseException.UnexpectedStatusCode(body, meta)) if meta.code.isClientError || meta.code.isServerError =>
            logger.error(s"$name-search/${meta.code}-error\n$body") *>
              none[SearchData].pure[F]
          case Left(error) =>
            logger.error(s"$name-search/error: ${error.getMessage}\n$error") *>
              timer.sleep(1.second) *> search(query, page)
        }
      }
}

object ArgosClient:
  def make[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveArgosClient[F](() => configProvider.argos, backend))
