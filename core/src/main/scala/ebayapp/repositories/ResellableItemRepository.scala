package ebayapp.repositories

import java.time.Instant

import cats.effect.ConcurrentEffect
import cats.implicits._
import ebayapp.domain.ResellableItem
import ebayapp.repositories.entities.ResellableItemEntity
import mongo4cats.client.MongoClientF
import mongo4cats.database.MongoCollectionF
import org.mongodb.scala.Document
import org.mongodb.scala.bson.conversions.Bson
import org.mongodb.scala.model.{Filters, Sorts}

trait ResellableItemRepository[F[_], I <: ResellableItem[_], E <: ResellableItemEntity] {
  def existsByUrl(listingUrl: String): F[Boolean]
  def save(item: I): F[Unit]
  def saveAll(items: Seq[I]): F[Unit]
  def findAll(limit: Option[Int] = None, from: Option[Instant] = None, to: Option[Instant] = None): fs2.Stream[F, I]
}

final class ResellableItemMongoRepository[F[_]: ConcurrentEffect, I <: ResellableItem[_], E <: ResellableItemEntity] (
    private val mongoCollection: MongoCollectionF[E],
    private val entityMapper: ResellableItemEntityMapper[I, E]
) extends ResellableItemRepository[F, I, E] {

  def existsByUrl(listingUrl: String): F[Boolean] =
    mongoCollection.count[F](Filters.eq("listingDetails.url", listingUrl)).map(_ > 0)

  def save(item: I): F[Unit] =
    mongoCollection.insertOne[F](entityMapper.toEntity(item)).void

  def saveAll(items: Seq[I]): F[Unit] =
    mongoCollection.insertMany[F](items.map(entityMapper.toEntity)).void

  def findAll(
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): fs2.Stream[F, I] =
    mongoCollection.find
      .sort(Sorts.descending("listingDetails.datePosted"))
      .filter(postedDateRangeSelector(from, to))
      .limit(limit.getOrElse(0))
      .stream[F]
      .map(entityMapper.toDomain)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Bson = {
    val fromFilter = from.map(d => Filters.gte("listingDetails.datePosted", d))
    val toFilter   = to.map(d => Filters.lt("listingDetails.datePosted", d))
    val filters    = List(fromFilter, toFilter).flatten
    if (filters.nonEmpty) Filters.and(filters: _*)
    else Document()
  }
}

object ResellableItemRepository {

  type VideoGameRepository[F[_]] = ResellableItemRepository[F, ResellableItem.VideoGame, ResellableItemEntity.VideoGame]

  def videoGamesMongo[F[_]: ConcurrentEffect](
      mongoClient: MongoClientF[F]
  ): F[VideoGameRepository[F]] =
    for {
      db   <- mongoClient.getDatabase("ebay-app")
      coll <- db.getCollection[ResellableItemEntity.VideoGame]("videoGames", ResellableItemEntity.videoGameCodec)
    } yield new ResellableItemMongoRepository[F, ResellableItem.VideoGame, ResellableItemEntity.VideoGame](
      coll,
      ResellableItemEntityMapper.videoGameEntityMapper
    )
}
