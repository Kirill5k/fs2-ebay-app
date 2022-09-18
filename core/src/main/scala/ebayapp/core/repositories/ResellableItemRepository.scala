package ebayapp.core.repositories

import java.time.Instant
import cats.effect.Async
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import cats.syntax.applicative.*
import cats.syntax.applicativeError.*
import com.mongodb.{DuplicateKeyException, MongoWriteException}
import ebayapp.core.domain.{ItemKind, ItemSummary, ResellableItem}
import ebayapp.core.repositories.entities.ResellableItemEntity
import mongo4cats.bson.Document
import mongo4cats.circe.given
import mongo4cats.bson.syntax.*
import mongo4cats.operations.{Aggregate, Filter, Projection, Sort}
import mongo4cats.collection.MongoCollection
import mongo4cats.database.MongoDatabase
import mongo4cats.models.database.CreateCollectionOptions

final case class SearchParams(
    kind: ItemKind,
    limit: Option[Int] = None,
    from: Option[Instant] = None,
    to: Option[Instant] = None,
    query: Option[String] = None
)

trait ResellableItemRepository[F[_]]:
  def existsByUrl(listingUrl: String): F[Boolean]
  def save(item: ResellableItem): F[Unit]
  def saveAll(items: Seq[ResellableItem]): F[Unit]
  def search(params: SearchParams): F[List[ResellableItem]]
  def summaries(params: SearchParams): F[List[ItemSummary]]

final private class ResellableItemMongoRepository[F[_]](
    private val mongoCollection: MongoCollection[F, ResellableItemEntity]
)(using
    F: Async[F]
) extends ResellableItemRepository[F] {

  private object Field:
    val Kind       = "kind"
    val DatePosted = "listingDetails.datePosted"
    val Url        = "listingDetails.url"

  private val videoGameSummaryProjection = Projection
    .computed("url", "$listingDetails.url")
    .computed("title", "$listingDetails.title")
    .computed("name", Document("$concat" := List("$itemDetails.name", " ", "$itemDetails.platform")))
    .computed("buyPrice", "$price.buy")
    .computed("exchangePrice", "$price.credit")

  def existsByUrl(listingUrl: String): F[Boolean] =
    mongoCollection.count(Filter.eq(Field.Url, listingUrl)).map(_ > 0)

  def save(item: ResellableItem): F[Unit] =
    mongoCollection
      .insertOne(ResellableItemEntity.from(item))
      .void
      .handleErrorWith {
        case _: DuplicateKeyException                              => F.unit
        case e: MongoWriteException if e.getError.getCode == 11000 => F.unit
        case e                                                     => e.raiseError[F, Unit]
      }

  def saveAll(items: Seq[ResellableItem]): F[Unit] =
    mongoCollection.insertMany(items.map(ResellableItemEntity.from)).void

  def search(params: SearchParams): F[List[ResellableItem]] =
    mongoCollection.find
      .sortByDesc(Field.DatePosted)
      .filter(params.toFilter)
      .limit(params.limit.getOrElse(Int.MaxValue))
      .all
      .map(_.map(_.toDomain).toList)

  def summaries(params: SearchParams): F[List[ItemSummary]] =
    mongoCollection
      .aggregateWithCodec[ItemSummary] {
        Aggregate
          .matchBy(params.toFilter)
          .sort(Sort.desc(Field.DatePosted))
          .limit(params.limit.getOrElse(Int.MaxValue))
          .project(videoGameSummaryProjection)
      }
      .all
      .map(_.toList)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Filter = {
    val fromFilter = from.map(d => Filter.gte(Field.DatePosted, d))
    val toFilter   = to.map(d => Filter.lt(Field.DatePosted, d))
    List(fromFilter, toFilter).flatten.foldLeft(Filter.empty)((acc, el) => acc && el)
  }

  extension (sp: SearchParams)
    def toFilter: Filter = postedDateRangeSelector(sp.from, sp.to) &&
      Filter.eq(Field.Kind, sp.kind) &&
      sp.query.fold(Filter.empty)(Filter.text)
}

object ResellableItemRepository:
  private val collectionName    = "items"
  private val collectionOptions = CreateCollectionOptions(capped = true, sizeInBytes = 268435456L)

  def mongo[F[_]](database: MongoDatabase[F])(using F: Async[F]): F[ResellableItemRepository[F]] =
    for
      collNames <- database.listCollectionNames
      _         <- F.unlessA(collNames.toSet.contains(collectionName))(database.createCollection(collectionName, collectionOptions))
      coll      <- database.getCollectionWithCodec[ResellableItemEntity](collectionName)
    yield ResellableItemMongoRepository[F](coll.withAddedCodec[ItemKind])
