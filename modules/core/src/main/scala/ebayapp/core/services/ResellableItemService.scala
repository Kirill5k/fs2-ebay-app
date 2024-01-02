package ebayapp.core.services

import cats.Monad
import ebayapp.core.domain.{ResellableItemSummary, ResellableItem}
import ebayapp.core.repositories.{ResellableItemRepository, SearchParams}

trait ResellableItemService[F[_]]:
  def search(filters: SearchParams): F[List[ResellableItem]]
  def summaries(filters: SearchParams): F[List[ResellableItemSummary]]

final class LiveResellableItemService[F[_]](
    private val repository: ResellableItemRepository[F]
) extends ResellableItemService[F] {

  override def search(filters: SearchParams): F[List[ResellableItem]] =
    repository.search(filters)

  override def summaries(filters: SearchParams): F[List[ResellableItemSummary]] =
    repository.summaries(filters)
}

object ResellableItemService {

  def make[F[_]: Monad](repository: ResellableItemRepository[F]): F[ResellableItemService[F]] =
    Monad[F].pure(LiveResellableItemService[F](repository))
}
