package ebayapp.core.clients.flannels

import cats.Monad
import cats.effect.Temporal
import ebayapp.core.clients.{HttpClient, SearchClient}
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import sttp.client3.SttpBackend

final private class LiveFlannelsClient[F[_]](
    private val configProvider: () => F[GenericRetailerConfig],
    override val httpBackend: SttpBackend[F, Any],
    override val proxyBackend: Option[SttpBackend[F, Any]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends SearchClient[F] with HttpClient[F] {

  override protected val name: String = "flannels"

  override def search(criteria: SearchCriteria): Stream[F, ResellableItem] = ???
}

object FlannelsClient {
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any],
      proxyBackend: Option[SttpBackend[F, Any]] = None
  ): F[SearchClient[F]] =
    Monad[F].pure(LiveFlannelsClient[F](() => configProvider.flannels, backend, proxyBackend))
}
