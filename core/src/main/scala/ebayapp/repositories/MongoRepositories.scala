package ebayapp.repositories

import cats.effect.ConcurrentEffect
import cats.implicits._
import ebayapp.repositories.ResellableItemRepository._
import mongo4cats.client.MongoClientF

final case class MongoRepositories[F[_]](
    videoGames: VideoGameRepository[F]
)

object MongoRepositories {

  def make[F[_]: ConcurrentEffect](
      mongoClient: MongoClientF[F]
  ): F[MongoRepositories[F]] =
    ResellableItemRepository.videoGamesMongo(mongoClient).map(MongoRepositories.apply)
}
