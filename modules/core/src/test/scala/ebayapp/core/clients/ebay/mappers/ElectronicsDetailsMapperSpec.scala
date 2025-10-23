package ebayapp.core.clients.ebay.mappers

import ebayapp.core.domain.search.ListingDetails
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import java.time.Instant

class ElectronicsDetailsMapperSpec extends AnyWordSpec with Matchers {

  val testListing = ListingDetails(
    "https://www.ebay.co.uk/itm/Call-of-Duty-Modern-Warfare-Xbox-One-/274204760218",
    "Samsung Galaxy S10 128gb UNLOCKED Prism Blue",
    None,
    Some("Samsung Galaxy S10 Used"),
    Some(
      "Up For GrabsSamsung Galaxy S10 128gb UNLOCKED Prism BlueGood ConditionThe usual minor wear and Tear as you would expect from a used phone.It has been in a case with a screen protector since new however they appears tohave 1 x Deeper Scratch no more than 1cm long to the top left of the phone which does not affect the use of the phone nor does it show up when the screen is in use and you have got to look for it to see it when the screen is off.Comes with Wall Plug and Wire.I like the phone but unf"
    ),
    Some("https://i.ebayimg.com/images/g/yOMAAOSw~5ReGEH2/s-l1600.jpg"),
    "USED",
    Instant.now,
    "EBAY:boris999",
    Map(
      "Brand"               -> "Samsung",
      "Model"               -> "Samsung Galaxy S10",
      "Storage Capacity"    -> "128 GB",
      "Network"             -> "Unlocked",
      "Colour"              -> "Pink",
      "Manufacturer Colour" -> "Rose Gold, Pink"
    )
  )

  "ElectronicsDetailsMapper" should {

    "map listing details details to electronics item details" in
      pending
  }
}
