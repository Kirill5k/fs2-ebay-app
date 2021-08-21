package ebayapp.core.services

import cats.Monad
import ebayapp.core.domain.ResellableItem
import ebayapp.core.repositories.{Filters, ResellableItemRepository}
import fs2.Stream

trait ResellableItemService[F[_]] {
  def findAll(filters: Filters): F[List[ResellableItem]]
  def stream(filters: Filters): Stream[F, ResellableItem]
  def findBy(query: String, filters: Filters): F[List[ResellableItem]]
}

final class LiveResellableItemService[F[_]](
    private val repository: ResellableItemRepository[F]
) extends ResellableItemService[F] {

  override def stream(filters: Filters): Stream[F, ResellableItem] =
    repository.stream(filters)

  override def findAll(filters: Filters): F[List[ResellableItem]] =
    repository.findAll(filters)

  override def findBy(query: String, filters: Filters): F[List[ResellableItem]] =
    repository.search(query, filters)
}

object ResellableItemService {

  def make[F[_]: Monad](repository: ResellableItemRepository[F]): F[ResellableItemService[F]] =
    Monad[F].pure(new LiveResellableItemService[F](repository))
}
