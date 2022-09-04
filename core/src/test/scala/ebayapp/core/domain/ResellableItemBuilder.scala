package ebayapp.core.domain

import ebayapp.core.clients.Retailer
import ebayapp.core.domain.ItemDetails.{Phone, VideoGame}
import ebayapp.core.domain.search.*

import java.time.Instant

object ResellableItemBuilder {

  val searchCriteria = SearchCriteria("item")

  def clothing(
      name: String,
      quantity: Int = 1,
      price: Double = 100.0,
      discount: Option[Int] = Some(50),
      foundWith: SearchCriteria = searchCriteria,
      retailer: Retailer = Retailer.Cex,
      datePosted: Instant = Instant.now
  ): ResellableItem =
    ResellableItem.clothing(
      ItemDetails.Clothing(name, "Foo-bar", "XXL"),
      ListingDetails(s"http://cex.com/${name.replaceAll(" ", "")}", name, None, None, None, None, "USED", datePosted, retailer.name.toUpperCase, Map.empty),
      BuyPrice(quantity, BigDecimal(price), discount),
      None,
      foundWith
    )

  def generic(
      name: String,
      quantity: Int = 1,
      price: Double = 1800.0,
      discount: Option[Int] = None,
      datePosted: Instant = Instant.now(),
      foundWith: SearchCriteria = searchCriteria
  ): ResellableItem =
    ResellableItem.generic(
      ItemDetails.Generic(name),
      ListingDetails(s"http://cex.com/${name.replaceAll(" ", "")}", name, None, None, None, None, "USED", datePosted, "CEX", Map.empty),
      BuyPrice(quantity, BigDecimal(price), discount),
      None,
      foundWith
    )

  def videoGame(
      name: String,
      datePosted: Instant = Instant.now(),
      platform: Option[String] = Some("XBOX ONE"),
      buyPrice: BuyPrice = BuyPrice(1, BigDecimal(32.99)),
      sellPrice: Option[SellPrice] = Some(SellPrice(BigDecimal(100), BigDecimal(80))),
      foundWith: SearchCriteria = searchCriteria
  ): ResellableItem =
    ResellableItem.videoGame(
      VideoGame(Some(name), platform, Some("2019"), Some("Action")),
      ListingDetails(
        s"https://www.ebay.co.uk/itm/$name".toLowerCase.replaceAll(" ", "-"),
        name,
        Some("Games"),
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
      buyPrice,
      sellPrice,
      foundWith
    )

  def mobilePhone(
      make: String,
      model: String,
      colour: String,
      storage: String = "16GB",
      datePosted: Instant = Instant.now(),
      foundWith: SearchCriteria = searchCriteria
  ): ResellableItem =
    ResellableItem.mobilePhone(
      Phone(Some(make), Some(model), Some(colour), Some(storage), Some("Unlocked"), Some("USED")),
      ListingDetails(
        s"https://www.ebay.co.uk/itm/$make-$model-$colour".toLowerCase.replaceAll(" ", "-"),
        s"$make $model $colour $storage",
        Some("Mobile phones"),
        Some(s"$make $model $colour $storage. Condition is Used. Dispatched with Royal Mail 1st Class Small parcel."),
        None,
        Some("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg"),
        "NEW",
        datePosted,
        "EBAY:168.robinhood",
        Map.empty
      ),
      BuyPrice(1, BigDecimal(99.99)),
      Some(SellPrice(BigDecimal(150), BigDecimal(110))),
      foundWith
    )
}
