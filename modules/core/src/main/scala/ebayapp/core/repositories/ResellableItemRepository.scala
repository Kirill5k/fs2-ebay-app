package ebayapp.core.repositories

import java.time.Instant
import cats.effect.Async
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import com.mongodb.{DuplicateKeyException, MongoWriteException}
import ebayapp.core.domain.{ItemKind, ResellableItem, SearchParams}
import ebayapp.core.repositories.entities.ResellableItemEntity
import kirill5k.common.cats.syntax.applicative.*
import mongo4cats.circe.given
import mongo4cats.operations.Filter
import mongo4cats.collection.MongoCollection
import mongo4cats.database.MongoDatabase
import mongo4cats.models.database.CreateCollectionOptions

trait ResellableItemRepository[F[_]]:
  def existsByUrl(listingUrl: String): F[Boolean]
  def save(item: ResellableItem): F[Unit]
  def search(params: SearchParams): F[List[ResellableItem]]

final private class ResellableItemMongoRepository[F[_]](
    private val mongoCollection: MongoCollection[F, ResellableItemEntity]
)(using
    F: Async[F]
) extends ResellableItemRepository[F] {

  private object Field:
    val ItemDetails    = "itemDetails"
    val ListingDetails = "listingDetails"
    val ItemKind       = s"${ItemDetails}.kind"
    val DatePosted     = s"${ListingDetails}.datePosted"
    val Url            = s"${ListingDetails}.url"
    val Title          = s"${ListingDetails}.title"
    val BuyPrice       = "price.buy"
    val ExchangePrice  = "price.credit"

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

  def search(params: SearchParams): F[List[ResellableItem]] =
    mongoCollection.find
      .sortByDesc(Field.DatePosted)
      .filter(params.toFilter)
      .skip(params.skip.getOrElse(0))
      .limit(params.limit.getOrElse(Int.MaxValue))
      .all
      .mapList(_.toDomain)

  private def postedDateRangeSelector(from: Option[Instant], to: Option[Instant]): Filter = {
    val fromFilter = from.map(d => Filter.gte(Field.DatePosted, d))
    val toFilter   = to.map(d => Filter.lt(Field.DatePosted, d))
    List(fromFilter, toFilter).flatten.foldLeft(Filter.empty)((acc, el) => acc && el)
  }

  extension (sp: SearchParams)
    def toFilter: Filter =
      postedDateRangeSelector(sp.from, sp.to) &&
        sp.kind.fold(Filter.empty)(k => Filter.eq(Field.ItemKind, k)) &&
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
