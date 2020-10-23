package ebayapp.domain

import java.time.Instant

import ebayapp.domain.search.SellPrice
import ItemDetails.{Game, Phone}
import ResellableItem.{GenericItem, MobilePhone, VideoGame}
import search._

object ResellableItemBuilder {

  def generic(name: String, quantity: Int = 1, price: Double = 1800.0): GenericItem =
    ResellableItem(
      ItemDetails.Generic(name),
      ListingDetails(s"http://cex.com/${name.replaceAll(" ", "")}", name, None, None, None, "USED", Instant.now(), "CEX", Map()),
      BuyPrice(quantity, BigDecimal(price)),
      None
    )

  def videoGame(
      name: String,
      datePosted: Instant = Instant.now(),
      platform: Option[String] = Some("XBOX ONE"),
      resellPrice: Option[SellPrice] = Some(SellPrice(BigDecimal.valueOf(100), BigDecimal.valueOf(80)))
  ): VideoGame =
    ResellableItem(
      Game(Some(name), platform, Some("2019"), Some("Action")),
      ListingDetails(
        s"https://www.ebay.co.uk/itm/$name".toLowerCase.replaceAll(" ", "-"),
        name,
        Some(
          s"$name xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter."
        ),
        None,
        Some("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg"),
        "NEW",
        datePosted,
        "EBAY:168.robinhood",
        Map(
          "Game Name"    -> name,
          "Release Year" -> "2019",
          "Platform"     -> "Microsoft Xbox One",
          "Genre"        -> "Action"
        )
      ),
      BuyPrice(1, BigDecimal(32.99)),
      resellPrice
    )

  def mobilePhone(
      make: String,
      model: String,
      colour: String,
      storage: String = "16GB",
      datePosted: Instant = Instant.now()
  ): MobilePhone =
    ResellableItem(
      Phone(Some(make), Some(model), Some(colour), Some(storage), Some("Unlocked"), Some("USED")),
      ListingDetails(
        s"https://www.ebay.co.uk/itm/$make-$model-$colour".toLowerCase.replaceAll(" ", "-"),
        s"$make $model $colour $storage",
        Some(s"$make $model $colour $storage. Condition is Used. Dispatched with Royal Mail 1st Class Small parcel."),
        None,
        Some("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg"),
        "NEW",
        datePosted,
        "EBAY:168.robinhood",
        Map()
      ),
      BuyPrice(1, BigDecimal(99.99)),
      Some(SellPrice(BigDecimal.valueOf(150), BigDecimal.valueOf(110)))
    )
}
