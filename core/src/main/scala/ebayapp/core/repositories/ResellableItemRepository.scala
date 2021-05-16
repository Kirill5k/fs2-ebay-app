package ebayapp.core.repositories

import java.time.Instant
import cats.effect.Async
import cats.implicits._
import io.circe.generic.auto._
import ebayapp.core.common.config.SearchQuery
import ebayapp.core.domain.ResellableItem
import ebayapp.core.repositories.entities.ResellableItemEntity
import mongo4cats.client.MongoClientF
import mongo4cats.circe._
import mongo4cats.database.MongoCollectionF
import org.bson.conversions.Bson
import org.bson.Document
import com.mongodb.client.model.{Filters, Sorts}
import fs2._

import java.util.Date

trait ResellableItemRepository[F[_], I <: ResellableItem[_], E <: ResellableItemEntity] {
  def existsByUrl(listingUrl: String): F[Boolean]
  def save(item: I): F[Unit]
  def saveAll(items: Seq[I]): F[Unit]
  def search(query: SearchQuery, limit: Option[Int] = None, from: Option[Instant] = None, to: Option[Instant] = None): F[List[I]]
  def findAll(limit: Option[Int] = None, from: Option[Instant] = None, to: Option[Instant] = None): F[List[I]]
  def stream(limit: Option[Int] = None, from: Option[Instant] = None, to: Option[Instant] = None): Stream[F, I]
}

final class ResellableItemMongoRepository[F[_]: Async, I <: ResellableItem[_], E <: ResellableItemEntity](
    private val mongoCollection: MongoCollectionF[E],
    private val entityMapper: ResellableItemEntityMapper[I, E]
) extends ResellableItemRepository[F, I, E] {

  def existsByUrl(listingUrl: String): F[Boolean] =
    mongoCollection.count[F](Filters.eq("listingDetails.url", listingUrl)).map(_ > 0)

  def save(item: I): F[Unit] =
    mongoCollection.insertOne[F](entityMapper.toEntity(item)).void

  def saveAll(items: Seq[I]): F[Unit] =
    mongoCollection.insertMany[F](items.map(entityMapper.toEntity)).void

  def search(
      query: SearchQuery,
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): F[List[I]] =
    mongoCollection
      .find
      .filter(postedDateRangeSelector(from, to))
      .filter(Filters.text(query.value))
      .limit(limit.getOrElse(0))
      .all[F]
      .map(_.map(entityMapper.toDomain).toList)

  def findAll(
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): F[List[I]] =
    mongoCollection.find
      .sort(Sorts.descending("listingDetails.datePosted"))
      .filter(postedDateRangeSelector(from, to))
      .limit(limit.getOrElse(0))
      .all[F]
      .map(_.map(entityMapper.toDomain).toList)

  def stream(
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): Stream[F, I] =
    mongoCollection.find
      .sort(Sorts.descending("listingDetails.datePosted"))
      .filter(postedDateRangeSelector(from, to))
      .limit(limit.getOrElse(0))
      .stream[F]
      .map(entityMapper.toDomain)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Bson = {
    val fromFilter = from.map(d => Filters.gte("listingDetails.datePosted", new Date(d.toEpochMilli)))
    val toFilter   = to.map(d => Filters.lt("listingDetails.datePosted", new Date(d.toEpochMilli)))
    val filters    = List(fromFilter, toFilter).flatten
    if (filters.nonEmpty) Filters.and(filters: _*)
    else new Document()
  }
}

object ResellableItemRepository {

  type VideoGameRepository[F[_]] = ResellableItemRepository[F, ResellableItem.VideoGame, ResellableItemEntity.VideoGame]

  def videoGamesMongo[F[_]: Async](
      mongoClient: MongoClientF[F]
  ): F[VideoGameRepository[F]] =
    for {
      db   <- mongoClient.getDatabase("ebay-app")
      coll <- db.getCollectionWithCirceCodecs[ResellableItemEntity.VideoGame]("videoGames")
    } yield new ResellableItemMongoRepository[F, ResellableItem.VideoGame, ResellableItemEntity.VideoGame](
      coll,
      ResellableItemEntityMapper.videoGameEntityMapper
    )
}
