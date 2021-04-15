package ebayapp.core.services

import java.time.Instant
import cats.effect.Sync
import cats.implicits._
import ebayapp.core.common.config.SearchQuery
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.ResellableItem.VideoGame
import ebayapp.core.repositories.ResellableItemRepository.VideoGameRepository
import fs2.Stream

trait ResellableItemService[F[_], D <: ItemDetails] {
  def save(item: ResellableItem[D]): F[Unit]
  def findAll(limit: Option[Int], from: Option[Instant], to: Option[Instant]): F[List[ResellableItem[D]]]
  def stream(limit: Option[Int], from: Option[Instant], to: Option[Instant]): Stream[F, ResellableItem[D]]
  def isNew(item: ResellableItem[D]): F[Boolean]
  def findBy(query: SearchQuery, limit: Option[Int], from: Option[Instant], to: Option[Instant]): F[List[ResellableItem[D]]]
}

final class VideoGameService[F[_]: Sync](
    private val repository: VideoGameRepository[F]
) extends ResellableItemService[F, ItemDetails.Game] {

  override def save(item: VideoGame): F[Unit] =
    repository.save(item)

  override def stream(limit: Option[Int], from: Option[Instant], to: Option[Instant]): Stream[F, VideoGame] =
    repository.stream(limit, from, to)

  override def isNew(item: VideoGame): F[Boolean] =
    repository.existsByUrl(item.listingDetails.url).map(!_)

  override def findAll(limit: Option[Int], from: Option[Instant], to: Option[Instant]): F[List[VideoGame]] =
    repository.findAll(limit, from, to)

  override def findBy(
      query: SearchQuery,
      limit: Option[Int],
      from: Option[Instant],
      to: Option[Instant]
  ): F[List[ResellableItem[ItemDetails.Game]]] =
    repository.search(query, limit, from, to)
}

object ResellableItemService {

  def videoGame[F[_]: Sync](repository: VideoGameRepository[F]): F[ResellableItemService[F, ItemDetails.Game]] =
    Sync[F].delay(new VideoGameService[F](repository))
}
