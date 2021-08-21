package ebayapp.core.services

import cats.Monad
import cats.implicits._
import ebayapp.core.domain.ResellableItem
import ebayapp.core.repositories.{Filters, ResellableItemRepository}
import fs2.Stream

trait ResellableItemService[F[_]] {
  def save(item: ResellableItem): F[Unit]
  def findAll(filters: Filters): F[List[ResellableItem]]
  def stream(filters: Filters): Stream[F, ResellableItem]
  def isNew(item: ResellableItem): F[Boolean]
  def findBy(query: String, filters: Filters): F[List[ResellableItem]]
}

final class LiveResellableItemService[F[_]: Monad](
    private val repository: ResellableItemRepository[F]
) extends ResellableItemService[F] {

  override def save(item: ResellableItem): F[Unit] =
    repository.save(item)

  override def stream(filters: Filters): Stream[F, ResellableItem] =
    repository.stream(filters)

  override def isNew(item: ResellableItem): F[Boolean] =
    repository.existsByUrl(item.listingDetails.url).map(!_)

  override def findAll(filters: Filters): F[List[ResellableItem]] =
    repository.findAll(filters)

  override def findBy(query: String, filters: Filters): F[List[ResellableItem]] =
    repository.search(query, filters)
}

object ResellableItemService {

  def make[F[_]: Monad](repository: ResellableItemRepository[F]): F[ResellableItemService[F]] =
    Monad[F].pure(new LiveResellableItemService[F](repository))
}
