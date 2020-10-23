package ebayapp.repositories

import java.time.Instant

import cats.effect.ConcurrentEffect
import cats.implicits._
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.repositories.entities.ResellableItemEntity
import mongo4cats.client.MongoClientF
import mongo4cats.database.MongoCollectionF
import org.mongodb.scala.Document
import org.mongodb.scala.bson.conversions.Bson
import org.mongodb.scala.model.Filters

class ResellableItemRepository[F[_]: ConcurrentEffect, D <: ItemDetails](
    private val mongoCollection: MongoCollectionF[ResellableItemEntity[D]],
    private val entityMapper: ResellableItemEntityMapper[D]
) {

  def existsByUrl(listingUrl: String): F[Boolean] =
    mongoCollection.count[F](Filters.eq("listingDetails.url", listingUrl)).map(_ > 0)

  def save(item: ResellableItem[D]): F[Unit] =
    mongoCollection.insertOne[F](entityMapper.toEntity(item)).void

  def saveAll(items: Seq[ResellableItem[D]]): F[Unit] =
    mongoCollection.insertMany[F](items.map(entityMapper.toEntity)).void

  def findAll(
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): fs2.Stream[F, ResellableItem[D]] =
    mongoCollection.find
      .filter(postedDateRangeSelector(from, to))
      .limit(limit.getOrElse(-1))
      .stream[F]
      .map(entityMapper.toDomain)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Bson = {
    val fromFilter = from.map(d => Filters.gte("listingDetails.datePosted", d.toString))
    val toFilter   = to.map(d => Filters.lt("listingDetails.datePosted", d.toString))
    val filters    = List(fromFilter, toFilter).flatten
    if (filters.nonEmpty) Filters.and(filters: _*)
    else Document()
  }
}

object ResellableItemRepository {

  def videoGames[F[_]: ConcurrentEffect](
      mongoClient: MongoClientF[F]
  ): F[ResellableItemRepository[F, ItemDetails.Game]] =
    for {
      db   <- mongoClient.getDatabase("ebay-app")
      coll <- db.getCollection[ResellableItemEntity[ItemDetails.Game]]("videoGames", ResellableItemEntity.videoGameCodec)
    } yield new ResellableItemRepository[F, ItemDetails.Game](coll, ResellableItemEntityMapper.videoGameEntityMapper)
}
