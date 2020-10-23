package ebayapp.repositories

import cats.effect.ConcurrentEffect
import cats.implicits._
import ebayapp.repositories.ResellableItemRepository._
import mongo4cats.client.MongoClientF

final case class Repositories[F[_]](
    videoGame: VideoGameRepository[F]
)

object Repositories {

  def make[F[_]: ConcurrentEffect](
      mongoClient: MongoClientF[F]
  ): F[Repositories[F]] =
    ResellableItemRepository.videoGame(mongoClient).map(Repositories.apply)
}
