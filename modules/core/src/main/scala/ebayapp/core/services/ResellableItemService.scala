package ebayapp.core.services

import cats.Monad
import ebayapp.core.domain.{ResellableItem, SearchParams}
import ebayapp.core.repositories.ResellableItemRepository

trait ResellableItemService[F[_]]:
  def search(filters: SearchParams): F[List[ResellableItem]]

final class LiveResellableItemService[F[_]](
    private val repository: ResellableItemRepository[F]
) extends ResellableItemService[F] {

  override def search(filters: SearchParams): F[List[ResellableItem]] =
    repository.search(filters)
}

object ResellableItemService:
  def make[F[_]: Monad](repository: ResellableItemRepository[F]): F[ResellableItemService[F]] =
    Monad[F].pure(LiveResellableItemService[F](repository))
