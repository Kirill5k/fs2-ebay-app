package ebayapp.services

import java.time.Instant

import cats.effect.Sync
import cats.implicits._
import ebayapp.domain.ResellableItem
import ebayapp.domain.ResellableItem.VideoGame
import ebayapp.repositories.ResellableItemRepository.VideoGameRepository

trait ResellableItemService[F[_], I <: ResellableItem[_]] {
  def save(item: I): F[Unit]
  def get(limit: Option[Int], from: Option[Instant], to: Option[Instant]): fs2.Stream[F, I]
  def isNew(item: I): F[Boolean]
}

final class VideoGameService[F[_]: Sync](
  private val repository: VideoGameRepository[F]
) extends ResellableItemService[F, ResellableItem.VideoGame] {

  override def save(item: VideoGame): F[Unit] =
    repository.save(item)

  override def get(limit: Option[Int], from: Option[Instant], to: Option[Instant]): fs2.Stream[F, VideoGame] =
    repository.findAll(limit, from, to)

  override def isNew(item: VideoGame): F[Boolean] =
    repository.existsByUrl(item.listingDetails.url).map(!_)
}

object ResellableItemService {

  def videoGame[F[_]: Sync](repository: VideoGameRepository[F]): F[ResellableItemService[F, VideoGame]] =
    Sync[F].delay(new VideoGameService[F](repository))
}
