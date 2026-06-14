package ebayapp.core.clients.argos

import cats.Monad
import cats.effect.Temporal
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.option.*
import ebayapp.core.clients.CurlImpersonateClient.RetrySpec
import ebayapp.core.clients.{CurlImpersonateClient, SearchClient}
import ebayapp.core.clients.argos.mappers.ArgosItemMapper
import ebayapp.core.clients.argos.responses.{ArgosSearchResponse, SearchData}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import io.circe.parser.decode
import sttp.client4.UriContext

final private class LiveArgosClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    private val client: CurlImpersonateClient[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] {

  private val name = "argos"

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
        val uri =
          uri"${config.baseUri}/finder-api/product;isSearch=true;queryParams={%22page%22:%22$page%22,%22templateType%22:null};searchTerm=${query};searchType=null?returnMeta=true"
        client.get(uri.toString, config.headers, RetrySpec.Default)
      }
      .flatMap { (code, body) =>
        if code.isSuccess then
          F.fromEither(decode[ArgosSearchResponse](body))
            .map(_.data.some)
            .handleErrorWith { error =>
              logger.error(s"$name-search response parsing error: ${error.getMessage}, \n$body") *>
                F.pure(none[SearchData])
            }
        else
          logger.error(s"$name-search/$code-error\n$body") *>
            F.pure(none[SearchData])
      }
      .handleErrorWith { error =>
        logger.error(s"$name-search/error: ${error.getMessage}\n$error") *>
          F.pure(none[SearchData])
      }
}

object ArgosClient:
  def make[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      client: CurlImpersonateClient[F]
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveArgosClient[F](() => configProvider.argos, client))
