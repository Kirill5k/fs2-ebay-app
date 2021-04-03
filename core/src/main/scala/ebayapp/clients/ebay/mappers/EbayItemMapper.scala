package ebayapp.clients.ebay.mappers

import ebayapp.clients.ItemMapper

import java.time.Instant
import ebayapp.clients.ebay.browse.responses.EbayItem
import ebayapp.domain
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.search.{BuyPrice, ListingDetails}

object EbayItemMapper {

  type EbayItemMapper[D <: ItemDetails] = ItemMapper[EbayItem, D]

  private val categories: Map[Int, String] = Map(
    139973 -> "Games"
  )

  implicit val phoneDetailsMapper = new EbayItemMapper[ItemDetails.Phone] {
    override def toDomain(ebayItem: EbayItem): ResellableItem[ItemDetails.Phone] = {
      val listing = listingDetails(ebayItem)
      domain.ResellableItem(PhoneDetailsMapper.from(listing), listing, price(ebayItem), None)
    }
  }

  implicit val gameDetailsMapper = new EbayItemMapper[ItemDetails.Game] {
    override def toDomain(ebayItem: EbayItem): ResellableItem[ItemDetails.Game] = {
      val listing = listingDetails(ebayItem)
      domain.ResellableItem(GameDetailsMapper.from(listing), listing, price(ebayItem), None)
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
