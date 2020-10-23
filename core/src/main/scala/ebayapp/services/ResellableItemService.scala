package ebayapp.services

import java.time.Instant

import cats.effect.Sync
import cats.implicits._
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.ResellableItem.VideoGame
import ebayapp.repositories.ResellableItemRepository.VideoGameRepository

trait ResellableItemService[F[_], D <: ItemDetails] {
  def save(item: ResellableItem[D]): F[Unit]
  def get(limit: Option[Int], from: Option[Instant], to: Option[Instant]): fs2.Stream[F, ResellableItem[D]]
  def isNew(item: ResellableItem[D]): F[Boolean]
}

final class VideoGameService[F[_]: Sync](
  private val repository: VideoGameRepository[F]
) extends ResellableItemService[F, ItemDetails.Game] {

  override def save(item: VideoGame): F[Unit] =
    repository.save(item)

  override def get(limit: Option[Int], from: Option[Instant], to: Option[Instant]): fs2.Stream[F, VideoGame] =
    repository.findAll(limit, from, to)

  override def isNew(item: VideoGame): F[Boolean] =
    repository.existsByUrl(item.listingDetails.url).map(!_)
}

object ResellableItemService {

  def videoGame[F[_]: Sync](repository: VideoGameRepository[F]): F[ResellableItemService[F, ItemDetails.Game]] =
    Sync[F].delay(new VideoGameService[F](repository))
}
