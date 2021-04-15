package ebayapp.core.repositories

import cats.effect.ConcurrentEffect
import cats.implicits._
import ebayapp.core.repositories.ResellableItemRepository._
import mongo4cats.client.MongoClientF

final case class Repositories[F[_]](
    videoGames: VideoGameRepository[F]
)

object Repositories {

  def make[F[_]: ConcurrentEffect](
      mongoClient: MongoClientF[F]
  ): F[Repositories[F]] =
    ResellableItemRepository.videoGamesMongo(mongoClient).map(Repositories.apply)
}
