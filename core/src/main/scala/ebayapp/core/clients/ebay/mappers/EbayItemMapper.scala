package ebayapp.core.clients.ebay.mappers

import ebayapp.core.clients.ItemMapper

import java.time.Instant
import ebayapp.core.clients.ebay.browse.responses.EbayItem
import ebayapp.core.common.errors.AppError.Critical
import ebayapp.core.domain
import ebayapp.core.domain.{ItemKind, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}

private[ebay] object EbayItemMapper {
  type EbayItemMapper = ItemMapper[EbayItem]

  def get(kind: ItemKind): Either[Throwable, EbayItemMapper] =
    kind match {
      case ItemKind.VideoGame   => Right(gameDetailsMapper)
      case ItemKind.MobilePhone => Right(phoneDetailsMapper)
      case kind                 => Left(Critical(s"unexpected item kind $kind in EbayClient"))
    }

  private val categories: Map[Int, String] = Map(
    139973 -> "Games"
  )

  val phoneDetailsMapper = new EbayItemMapper {
    override def toDomain(ebayItem: EbayItem): ResellableItem = {
      val listing = listingDetails(ebayItem)
      domain.ResellableItem.mobilePhone(PhoneDetailsMapper.from(listing), listing, price(ebayItem), None)
    }
  }

  val gameDetailsMapper = new EbayItemMapper {
    override def toDomain(ebayItem: EbayItem): ResellableItem = {
      val listing = listingDetails(ebayItem)
      domain.ResellableItem.videoGame(GameDetailsMapper.from(listing), listing, price(ebayItem), None)
    }
  }

  private[mappers] def listingDetails(item: EbayItem): ListingDetails =
    ListingDetails(
      url = item.itemWebUrl,
      title = item.title,
      category = categories.get(item.categoryId),
      shortDescription = item.shortDescription,
      description = item.description.map(_.replaceAll("(?i)<[^>]*>", "")).map(_.slice(0, 500)),
      image = item.image.map(_.imageUrl),
      condition = item.condition.toUpperCase,
      datePosted = Instant.now,
      seller = item.seller.username.fold("EBAY")(s => s"EBAY:$s"),
      properties = item.localizedAspects.getOrElse(List()).map(prop => prop.name -> prop.value).toMap
    )

  private[mappers] def price(item: EbayItem): BuyPrice = {
    val postageCost = item.shippingOptions
      .getOrElse(Nil)
      .map(_.shippingCost)
      .map(_.value)
      .minOption

    val quantity = item.estimatedAvailabilities
      .getOrElse(Nil)
      .flatMap(av => av.estimatedAvailableQuantity.orElse(av.availabilityThreshold))
      .minOption

    BuyPrice(quantity.getOrElse(1), item.price.value + postageCost.getOrElse(BigDecimal(0)))
  }
}
