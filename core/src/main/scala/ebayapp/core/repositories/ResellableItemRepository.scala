package ebayapp.core.repositories

import java.time.Instant
import cats.effect.Async
import cats.implicits._
import io.circe.generic.auto._
import ebayapp.core.common.config.SearchQuery
import ebayapp.core.domain.ResellableItem
import ebayapp.core.repositories.entities.ResellableItemEntity
import mongo4cats.circe._
import mongo4cats.collection.operations.Filter
import mongo4cats.collection.MongoCollection
import fs2._
import mongo4cats.database.MongoDatabase

trait ResellableItemRepository[F[_], I <: ResellableItem[_], E <: ResellableItemEntity] {
  def existsByUrl(listingUrl: String): F[Boolean]
  def save(item: I): F[Unit]
  def saveAll(items: Seq[I]): F[Unit]
  def search(query: SearchQuery, limit: Option[Int] = None, from: Option[Instant] = None, to: Option[Instant] = None): F[List[I]]
  def findAll(limit: Option[Int] = None, from: Option[Instant] = None, to: Option[Instant] = None): F[List[I]]
  def stream(limit: Option[Int] = None, from: Option[Instant] = None, to: Option[Instant] = None): Stream[F, I]
}

final class ResellableItemMongoRepository[F[_]: Async, I <: ResellableItem[_], E <: ResellableItemEntity](
    private val mongoCollection: MongoCollection[F, E]
)(implicit
    val entityMapper: ResellableItemEntityMapper[I, E]
) extends ResellableItemRepository[F, I, E] {

  def existsByUrl(listingUrl: String): F[Boolean] =
    mongoCollection.count(Filter.eq("listingDetails.url", listingUrl)).map(_ > 0)

  def save(item: I): F[Unit] =
    mongoCollection.insertOne(entityMapper.toEntity(item)).void

  def saveAll(items: Seq[I]): F[Unit] =
    mongoCollection.insertMany(items.map(entityMapper.toEntity)).void

  def search(
      query: SearchQuery,
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): F[List[I]] =
    mongoCollection.find
      .filter(postedDateRangeSelector(from, to) && Filter.text(query.value))
      .limit(limit.getOrElse(0))
      .all
      .map(_.map(entityMapper.toDomain).toList)

  def findAll(
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): F[List[I]] =
    mongoCollection.find
      .sortByDesc("listingDetails.datePosted")
      .filter(postedDateRangeSelector(from, to))
      .limit(limit.getOrElse(0))
      .all
      .map(_.map(entityMapper.toDomain).toList)

  def stream(
      limit: Option[Int] = None,
      from: Option[Instant] = None,
      to: Option[Instant] = None
  ): Stream[F, I] =
    mongoCollection.find
      .sortByDesc("listingDetails.datePosted")
      .filter(postedDateRangeSelector(from, to))
      .limit(limit.getOrElse(0))
      .stream
      .map(entityMapper.toDomain)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Filter = {
    val fromFilter = from.map(d => Filter.gte("listingDetails.datePosted", d))
    val toFilter   = to.map(d => Filter.lt("listingDetails.datePosted", d))
    List(fromFilter, toFilter).flatten.foldLeft(Filter.empty)((acc, el) => acc && el)
  }
}

object ResellableItemRepository {

  type VideoGameRepository[F[_]] = ResellableItemRepository[F, ResellableItem.VideoGame, ResellableItemEntity.VideoGame]

  def videoGamesMongo[F[_]: Async](
      database: MongoDatabase[F]
  ): F[VideoGameRepository[F]] =
    database
      .getCollectionWithCodec[ResellableItemEntity.VideoGame]("videoGames")
      .map(coll => new ResellableItemMongoRepository[F, ResellableItem.VideoGame, ResellableItemEntity.VideoGame](coll))
}
