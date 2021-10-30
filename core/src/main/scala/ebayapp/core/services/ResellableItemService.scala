package ebayapp.core.services

import cats.Monad
import ebayapp.core.domain.{ItemSummary, ResellableItem}
import ebayapp.core.repositories.{Filters, ResellableItemRepository}

trait ResellableItemService[F[_]] {
  def findAll(filters: Filters): F[List[ResellableItem]]
  def summaries(filters: Filters): F[List[ItemSummary]]
  def findBy(query: String, filters: Filters): F[List[ResellableItem]]
}

final class LiveResellableItemService[F[_]](
    private val repository: ResellableItemRepository[F]
) extends ResellableItemService[F] {

  override def findAll(filters: Filters): F[List[ResellableItem]] =
    repository.findAll(filters)

  override def findBy(query: String, filters: Filters): F[List[ResellableItem]] =
    repository.search(query, filters)

  override def summaries(filters: Filters): F[List[ItemSummary]] =
    repository.summaries(filters)
}

object ResellableItemService {

  def make[F[_]: Monad](repository: ResellableItemRepository[F]): F[ResellableItemService[F]] =
    Monad[F].pure(new LiveResellableItemService[F](repository))
}
