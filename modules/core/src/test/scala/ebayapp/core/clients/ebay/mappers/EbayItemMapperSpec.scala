package ebayapp.core.clients.ebay.mappers

import cats.syntax.option.*
import ebayapp.core.clients.ebay.browse.responses.*
import ebayapp.core.domain.ItemDetails
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class EbayItemMapperSpec extends AnyWordSpec with Matchers {

  val searchCriteria = SearchCriteria("search")

  val videoGameEbayItem = EbayItem(
    "item-1",
    "Call of Duty Modern Warfare xbox one 2019",
    Some(
      "call of duty modern warfare xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter."
    ),
    None,
    Some("Video Games & Consoles|Video Games"),
    139973,
    ItemPrice(BigDecimal(30.00), "GBP"),
    "New",
    Some(ItemImage("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg")),
    ItemSeller(Some("168.robinhood"), Some(100), Some(150)),
    List(
      ItemProperty("Game Name", "Call of Duty: Modern Warfare"),
      ItemProperty("Release Year", "2019"),
      ItemProperty("Platform", "Microsoft Xbox One"),
      ItemProperty("Genre", "Action")
    ).some,
    Set("FIXED_PRICE"),
    "https://www.ebay.co.uk/itm/call-of-duty-modern-warfare-xbox-one-2019-/333474293066",
    None,
    None,
    None,
    None,
    None,
    List(
      ItemShippingOption("Royal Mail 1st class", ShippingCost(BigDecimal(4.99), "GBR")),
      ItemShippingOption("Royal Mail 2nd class", ShippingCost(BigDecimal(2.99), "GBR"))
    ).some,
    List(ItemAvailabilities(None, Some(5))).some
  )

  val mobilePhoneEbayItem = EbayItem(
    "item-2",
    "Samsung Galaxy S10 128gb UNLOCKED Prism Blue",
    Some("Samsung Galaxy S10 Used"),
    Some(
      "<div><u>Up For Grabs</u></div><div><br></div><div><div><div style=\"color:rgb(0, 0, 0); font-family:Arial; font-size:14px; font-style:normal; font-variant:normal; font-weight:400; letter-spacing:normal; orphans:2; text-align:left; text-decoration:none; text-indent:0px; text-transform:none; white-space:normal; word-spacing:0px;\">Samsung Galaxy S10 128gb UNLOCKED Prism Blue</div></div><br></div><div>Good Condition</div><div>The usual minor wear and Tear as you would expect from a used phone.</div><div>It has been in a case with a screen protector since new however they appears to</div><div>have 1 x Deeper Scratch no more than 1cm long to the top left of the phone which does not affect the use of the phone nor does it show up when the screen is in use and you have got to look for it to see it when the screen is off.</div><div><br></div><div>Comes with Wall Plug and Wire.</div><div><br></div><div>I like the phone but unfortunately I changed from Apple to android and just can't get away with it.</div><div>So I ordered the iPhone 11 last night for delivery today.</div><div><br></div><div>I'm always 100% honest in my descriptions and this is how i've obtained my 100% feedback rating as a seller.</div><div>The stratch isn't really noticable but it's there so I would not sell the phone without advising.</div><div><br></div><div>Pictures to follow.</div><div><br></div><div>Music Magie are currently offering £352 for the phone so please no silly offers.</div><div><br></div><div><u><br></u></div><div><br></div>"
    ),
    Some("Mobile Phones & Communication|Mobile & Smart Phones"),
    0,
    ItemPrice(BigDecimal(425.00), "GBP"),
    "Used",
    Some(ItemImage("https://i.ebayimg.com/images/g/yOMAAOSw~5ReGEH2/s-l1600.jpg")),
    ItemSeller(Some("jb-liquidation3"), Some(100), Some(98)),
    List(
      ItemProperty("Brand", "Samsung"),
      ItemProperty("Model", "Samsung Galaxy S10"),
      ItemProperty("Network", "Unlocked"),
      ItemProperty("Storage Capacity", "128 GB"),
      ItemProperty("Colour", "Blue")
    ).some,
    Set("FIXED_PRICE", "BEST_OFFER"),
    "https://www.ebay.co.uk/itm/Samsung-Galaxy-S10-128gb-UNLOCKED-Prism-Blue-/114059888671",
    Some("Blue"),
    Some("Samsung"),
    None,
    None,
    None,
    List(ItemShippingOption("Royal Mail 1st class", ShippingCost(BigDecimal(4.99), "GBR"))).some,
    List(ItemAvailabilities(Some(10), None)).some
  )

  "EbayItemMapper" should {

    "transform to GameDetails" in {
      val game = EbayItemMapper.gameDetailsMapper.toDomain(searchCriteria)(videoGameEbayItem)

      game.itemDetails mustBe ItemDetails.VideoGame(Some("Call of Duty Modern Warfare"), Some("XBOX ONE"), Some("2019"), Some("Action"))

      game.listingDetails mustBe ListingDetails(
        "https://www.ebay.co.uk/itm/call-of-duty-modern-warfare-xbox-one-2019-/333474293066",
        "Call of Duty Modern Warfare xbox one 2019",
        Some("Games"),
        Some(
          "call of duty modern warfare xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter."
        ),
        None,
        Some("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg"),
        "NEW",
        game.listingDetails.datePosted,
        "EBAY:168.robinhood",
        Map(
          "Game Name"    -> "Call of Duty: Modern Warfare",
          "Release Year" -> "2019",
          "Platform"     -> "Microsoft Xbox One",
          "Genre"        -> "Action",
          "Postage"      -> "2.99",
          "Price"        -> "30.0",
          "Currency"     -> "GBP",
          "CategoryId"   -> "139973"
        )
      )

      game.buyPrice mustBe BuyPrice(5, BigDecimal(32.99))
    }

    "transform to GameDetails even if no shipping options" in {
      val game = EbayItemMapper.gameDetailsMapper.toDomain(searchCriteria)(videoGameEbayItem.copy(shippingOptions = None))

      game.itemDetails mustBe (ItemDetails.VideoGame(Some("Call of Duty Modern Warfare"), Some("XBOX ONE"), Some("2019"), Some("Action")))

      game.listingDetails mustBe ListingDetails(
        "https://www.ebay.co.uk/itm/call-of-duty-modern-warfare-xbox-one-2019-/333474293066",
        "Call of Duty Modern Warfare xbox one 2019",
        Some("Games"),
        Some(
          "call of duty modern warfare xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter."
        ),
        None,
        Some("https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg"),
        "NEW",
        game.listingDetails.datePosted,
        "EBAY:168.robinhood",
        Map(
          "Game Name"    -> "Call of Duty: Modern Warfare",
          "Release Year" -> "2019",
          "Platform"     -> "Microsoft Xbox One",
          "Genre"        -> "Action",
          "Postage"      -> "0",
          "Price"        -> "30.0",
          "Currency"     -> "GBP",
          "CategoryId"   -> "139973"
        )
      )

      game.buyPrice mustBe BuyPrice(5, BigDecimal(30.0))
    }

    "transform to PhoneDetails" in {
      val phone = EbayItemMapper.phoneDetailsMapper.toDomain(searchCriteria)(mobilePhoneEbayItem)

      phone.itemDetails mustBe ItemDetails.Phone(
        Some("Samsung"),
        Some("Samsung Galaxy S10"),
        Some("Blue"),
        Some("128GB"),
        Some("Unlocked"),
        Some("USED")
      )

      phone.listingDetails mustBe ListingDetails(
        "https://www.ebay.co.uk/itm/Samsung-Galaxy-S10-128gb-UNLOCKED-Prism-Blue-/114059888671",
        "Samsung Galaxy S10 128gb UNLOCKED Prism Blue",
        Some("Mobile Phones & Communication|Mobile & Smart Phones"),
        Some("Samsung Galaxy S10 Used"),
        Some(
          "Up For GrabsSamsung Galaxy S10 128gb UNLOCKED Prism BlueGood ConditionThe usual minor wear and Tear as you would expect from a used phone.It has been in a case with a screen protector since new however they appears tohave 1 x Deeper Scratch no more than 1cm long to the top left of the phone which does not affect the use of the phone nor does it show up when the screen is in use and you have got to look for it to see it when the screen is off.Comes with Wall Plug and Wire.I like the phone but unf"
        ),
        Some("https://i.ebayimg.com/images/g/yOMAAOSw~5ReGEH2/s-l1600.jpg"),
        "USED",
        phone.listingDetails.datePosted,
        "EBAY:jb-liquidation3",
        Map(
          "Brand"            -> "Samsung",
          "Model"            -> "Samsung Galaxy S10",
          "Storage Capacity" -> "128 GB",
          "Network"          -> "Unlocked",
          "Colour"           -> "Blue",
          "Postage"          -> "4.99",
          "Price"            -> "425.0",
          "Currency"         -> "GBP",
          "CategoryId"       -> "0"
        )
      )

      phone.buyPrice mustBe BuyPrice(10, BigDecimal(429.99))
    }
  }
}
