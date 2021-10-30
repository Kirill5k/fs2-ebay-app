package ebayapp.core.repositories

import java.time.Instant
import cats.effect.Async
import cats.syntax.functor._
import cats.syntax.flatMap._
import cats.syntax.applicative._
import io.circe.generic.auto._
import ebayapp.core.domain.{ItemKind, ItemSummary, ResellableItem}
import ebayapp.core.repositories.entities.ResellableItemEntity
import mongo4cats.bson.Document
import mongo4cats.circe._
import mongo4cats.collection.operations.{Aggregate, Filter, Projection, Sort}
import mongo4cats.collection.MongoCollection
import mongo4cats.database.{CreateCollectionOptions, MongoDatabase}

import scala.jdk.CollectionConverters._

final case class Filters(
    kind: ItemKind,
    limit: Option[Int] = None,
    from: Option[Instant] = None,
    to: Option[Instant] = None,
    query: Option[String] = None
)

trait ResellableItemRepository[F[_]] {
  def existsByUrl(listingUrl: String): F[Boolean]
  def save(item: ResellableItem): F[Unit]
  def saveAll(items: Seq[ResellableItem]): F[Unit]
  def search(filters: Filters): F[List[ResellableItem]]
  def summaries(filters: Filters): F[List[ItemSummary]]
}

final private class ResellableItemMongoRepository[F[_]: Async](
    private val mongoCollection: MongoCollection[F, ResellableItemEntity]
) extends ResellableItemRepository[F] {

  private object Field {
    val Kind       = "kind"
    val DatePosted = "listingDetails.datePosted"
    val Url        = "listingDetails.url"
  }

  private val videoGameSummaryProjection = Projection
    .computed("url", "$listingDetails.url")
    .computed("title", "$listingDetails.title")
    .computed("name", Document("$concat" -> List("$itemDetails.name", " ", "$itemDetails.platform").asJava))
    .computed("buyPrice", "$price.buy")
    .computed("exchangePrice", "$price.credit")

  def existsByUrl(listingUrl: String): F[Boolean] =
    mongoCollection.count(Filter.eq(Field.Url, listingUrl)).map(_ > 0)

  def save(item: ResellableItem): F[Unit] =
    mongoCollection.insertOne(ResellableItemEntityMapper.toEntity(item)).void

  def saveAll(items: Seq[ResellableItem]): F[Unit] =
    mongoCollection.insertMany(items.map(ResellableItemEntityMapper.toEntity)).void

  def search(filters: Filters): F[List[ResellableItem]] =
    mongoCollection.find
      .sortByDesc(Field.DatePosted)
      .filter(searchFilter(filters))
      .limit(filters.limit.getOrElse(0))
      .all
      .map(_.map(ResellableItemEntityMapper.toDomain).toList)

  def summaries(filters: Filters): F[List[ItemSummary]] =
    mongoCollection
      .aggregateWithCodec[ItemSummary] {
        Aggregate
          .sort(Sort.asc(Field.DatePosted))
          .matchBy(searchFilter(filters))
          .limit(filters.limit.getOrElse(0))
          .project(videoGameSummaryProjection)
      }
      .all
      .map(_.toList)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Filter = {
    val fromFilter = from.map(d => Filter.gte(Field.DatePosted, d))
    val toFilter   = to.map(d => Filter.lt(Field.DatePosted, d))
    List(fromFilter, toFilter).flatten.foldLeft(Filter.empty)((acc, el) => acc && el)
  }

  private def searchFilter(filters: Filters): Filter =
    postedDateRangeSelector(filters.from, filters.to) &&
      Filter.eq(Field.Kind, filters.kind) &&
      filters.query.fold(Filter.empty)(Filter.text)
}

object ResellableItemRepository {

  def mongo[F[_]: Async](database: MongoDatabase[F]): F[ResellableItemRepository[F]] =
    for {
      collNames <- database.listCollectionNames
      collName    = "items"
      collOptions = CreateCollectionOptions().capped(true).sizeInBytes(268435456L)
      _    <- if (collNames.toSet.contains(collName)) ().pure[F] else database.createCollection(collName, collOptions)
      coll <- database.getCollectionWithCodec[ResellableItemEntity](collName)
    } yield new ResellableItemMongoRepository[F](coll.withAddedCodec[ItemKind])
}
