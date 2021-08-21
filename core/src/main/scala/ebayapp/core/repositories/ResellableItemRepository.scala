package ebayapp.core.repositories

import java.time.Instant
import cats.effect.Async
import cats.implicits._
import io.circe.generic.extras.auto._
import ebayapp.core.common.json.genDevConfig
import ebayapp.core.domain.{ItemKind, ResellableItem}
import ebayapp.core.repositories.entities.ResellableItemEntity
import mongo4cats.circe._
import mongo4cats.collection.operations.Filter
import mongo4cats.collection.MongoCollection
import fs2._
import mongo4cats.database.{CreateCollectionOptions, MongoDatabase}

final case class Filters(
    kind: ItemKind,
    limit: Option[Int] = None,
    from: Option[Instant] = None,
    to: Option[Instant] = None
)

trait ResellableItemRepository[F[_]] {
  def existsByUrl(listingUrl: String): F[Boolean]
  def save(item: ResellableItem): F[Unit]
  def saveAll(items: Seq[ResellableItem]): F[Unit]
  def search(query: String, filters: Filters): F[List[ResellableItem]]
  def findAll(filters: Filters): F[List[ResellableItem]]
  def stream(filters: Filters): Stream[F, ResellableItem]
}

final class ResellableItemMongoRepository[F[_]: Async](
    private val mongoCollection: MongoCollection[F, ResellableItemEntity]
)(implicit
    val entityMapper: ResellableItemEntityMapper
) extends ResellableItemRepository[F] {

  def existsByUrl(listingUrl: String): F[Boolean] =
    mongoCollection.count(Filter.eq("listingDetails.url", listingUrl)).map(_ > 0)

  def save(item: ResellableItem): F[Unit] =
    mongoCollection.insertOne(entityMapper.toEntity(item)).void

  def saveAll(items: Seq[ResellableItem]): F[Unit] =
    mongoCollection.insertMany(items.map(entityMapper.toEntity)).void

  def search(
      query: String,
      filters: Filters
  ): F[List[ResellableItem]] =
    mongoCollection.find
      .filter(postedDateRangeSelector(filters.from, filters.to) && Filter.text(query) && Filter.eq("kind", filters.kind.value))
      .limit(filters.limit.getOrElse(0))
      .all
      .map(_.map(entityMapper.toDomain).toList)

  def findAll(filters: Filters): F[List[ResellableItem]] =
    mongoCollection.find
      .sortByDesc("listingDetails.datePosted")
      .filter(postedDateRangeSelector(filters.from, filters.to) && Filter.eq("kind", filters.kind.value))
      .limit(filters.limit.getOrElse(0))
      .all
      .map(_.map(entityMapper.toDomain).toList)

  def stream(filters: Filters): Stream[F, ResellableItem] =
    mongoCollection.find
      .sortByDesc("listingDetails.datePosted")
      .filter(postedDateRangeSelector(filters.from, filters.to) && Filter.eq("kind", filters.kind.value))
      .limit(filters.limit.getOrElse(0))
      .stream
      .map(entityMapper.toDomain)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Filter = {
    val fromFilter = from.map(d => Filter.gte("listingDetails.datePosted", d))
    val toFilter   = to.map(d => Filter.lt("listingDetails.datePosted", d))
    List(fromFilter, toFilter).flatten.foldLeft(Filter.empty)((acc, el) => acc && el)
  }
}

object ResellableItemRepository {

  def mongo[F[_]: Async](
      database: MongoDatabase[F]
  ): F[ResellableItemRepository[F]] =
    for {
      collNames <- database.collectionNames
      collName    = "items"
      collOptions = CreateCollectionOptions().capped(true).sizeInBytes(268_435_456L)
      _    <- if (collNames.toSet.contains(collName)) ().pure[F] else database.createCollection(collName, collOptions)
      coll <- database.getCollectionWithCodec[ResellableItemEntity](collName)
    } yield new ResellableItemMongoRepository[F](coll)
}
