package ebayapp.core.clients.ebay.mappers

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.ebay.browse.responses.EbayItem
import ebayapp.kernel.errors.AppError
import ebayapp.core.domain.{ItemDetails, ItemKind, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}

import java.time.Instant

private[ebay] object EbayItemMapper {
  object Props {
    val categoryId = "CategoryId"
    val price      = "Price"
    val postage    = "Postage"
    val currency   = "Currency"
  }

  type EbayItemMapper = ItemMapper[EbayItem]

  def get(criteria: SearchCriteria): Either[Throwable, EbayItemMapper] =
    criteria.itemKind
      .map(EbayItemMapper.get)
      .toRight(AppError.Critical("item kind is required in ebay-client"))

  def get(kind: ItemKind): EbayItemMapper =
    kind match {
      case ItemKind.VideoGame   => gameDetailsMapper
      case ItemKind.MobilePhone => phoneDetailsMapper
      case _                    => genericDetailsMapper
    }

  private val categories: Map[Int, String] = Map(
    139973 -> "Games"
  )

  val phoneDetailsMapper = new EbayItemMapper {
    override def toDomain(foundWith: SearchCriteria)(ebayItem: EbayItem): ResellableItem = {
      val listing = listingDetails(ebayItem)
      ResellableItem.mobilePhone(PhoneDetailsMapper.from(listing), listing, price(ebayItem), None, foundWith)
    }
  }

  val gameDetailsMapper = new EbayItemMapper {
    override def toDomain(foundWith: SearchCriteria)(ebayItem: EbayItem): ResellableItem = {
      val listing = listingDetails(ebayItem)
      ResellableItem.videoGame(GameDetailsMapper.from(listing), listing, price(ebayItem), None, foundWith)
    }
  }

  val genericDetailsMapper = new EbayItemMapper {
    override def toDomain(foundWith: SearchCriteria)(ebayItem: EbayItem): ResellableItem =
      ResellableItem.generic(ItemDetails.Generic(ebayItem.title), listingDetails(ebayItem), price(ebayItem), None, foundWith)
  }

  private[mappers] def listingDetails(item: EbayItem): ListingDetails =
    ListingDetails(
      url = item.itemWebUrl,
      title = item.title,
      category = categories.get(item.categoryId).orElse(Some(item.categoryPath)),
      shortDescription = item.shortDescription,
      description = item.description.map(_.replaceAll("(?i)<[^>]*>", "")).map(_.slice(0, 500)),
      image = item.image.map(_.imageUrl),
      condition = item.condition.toUpperCase,
      datePosted = Instant.now,
      seller = item.seller.username.fold("EBAY")(s => s"EBAY:$s"),
      properties = {
        val itemProps = item.localizedAspects.getOrElse(Nil).map(prop => prop.name -> prop.value).toMap
        val priceProps = Map(
          Props.price    -> item.price.value.toString(),
          Props.currency -> item.price.currency,
          Props.postage  -> postageCost(item).toString()
        )
        val otherProps = Map(Props.categoryId -> item.categoryId.toString)
        itemProps.concat(priceProps).concat(otherProps)
      }
    )

  private[mappers] def price(item: EbayItem): BuyPrice = {
    val quantity = item.estimatedAvailabilities
      .getOrElse(Nil)
      .flatMap(av => av.estimatedAvailableQuantity.orElse(av.availabilityThreshold))
      .minOption

    BuyPrice(quantity.getOrElse(1), item.price.value + postageCost(item))
  }

  private[mappers] def postageCost(item: EbayItem): BigDecimal =
    item.shippingOptions
      .getOrElse(Nil)
      .map(_.shippingCost)
      .map(_.value)
      .minOption
      .getOrElse(BigDecimal(0))
}
