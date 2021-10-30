package ebayapp.core.services

import cats.Monad
import ebayapp.core.domain.{ItemSummary, ResellableItem}
import ebayapp.core.repositories.{SearchParams, ResellableItemRepository}

trait ResellableItemService[F[_]] {
  def search(filters: SearchParams): F[List[ResellableItem]]
  def summaries(filters: SearchParams): F[List[ItemSummary]]
}

final class LiveResellableItemService[F[_]](
    private val repository: ResellableItemRepository[F]
) extends ResellableItemService[F] {

  override def search(filters: SearchParams): F[List[ResellableItem]] =
    repository.search(filters)

  override def summaries(filters: SearchParams): F[List[ItemSummary]] =
    repository.summaries(filters)
}

object ResellableItemService {

  def make[F[_]: Monad](repository: ResellableItemRepository[F]): F[ResellableItemService[F]] =
    Monad[F].pure(new LiveResellableItemService[F](repository))
}
