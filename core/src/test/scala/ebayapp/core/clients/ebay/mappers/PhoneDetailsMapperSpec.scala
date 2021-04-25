package ebayapp.core.clients.ebay.mappers

import java.time.Instant

import ebayapp.core.domain.search.ListingDetails
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class PhoneDetailsMapperSpec extends AnyWordSpec with Matchers {

  val testListing = ListingDetails(
    "https://www.ebay.co.uk/itm/Call-of-Duty-Modern-Warfare-Xbox-One-/274204760218",
    "Samsung Galaxy S10 128gb UNLOCKED Prism Blue",
    None,
    Some("Samsung Galaxy S10 Used"),
    Some("Up For GrabsSamsung Galaxy S10 128gb UNLOCKED Prism BlueGood ConditionThe usual minor wear and Tear as you would expect from a used phone.It has been in a case with a screen protector since new however they appears tohave 1 x Deeper Scratch no more than 1cm long to the top left of the phone which does not affect the use of the phone nor does it show up when the screen is in use and you have got to look for it to see it when the screen is off.Comes with Wall Plug and Wire.I like the phone but unf"),
    Some("https://i.ebayimg.com/images/g/yOMAAOSw~5ReGEH2/s-l1600.jpg"),
    "USED",
    Instant.now,
    "EBAY:boris999",
    Map(
      "Brand" -> "Samsung",
      "Model" -> "Samsung Galaxy S10",
      "Storage Capacity" -> "128 GB",
      "Network" -> "Unlocked",
      "Colour" -> "Pink",
      "Manufacturer Colour" -> "Rose Gold, Pink"
    )
  )

  "PhoneDetailsMapper" should {

    "get details from properties if they are present" in {
      val listingDetails = testListing.copy()

      val phoneDetails = PhoneDetailsMapper.from(listingDetails)

      phoneDetails.make mustBe (Some("Samsung"))
      phoneDetails.model mustBe (Some("Samsung Galaxy S10"))
      phoneDetails.storageCapacity mustBe (Some("128GB"))
      phoneDetails.network mustBe (Some("Unlocked"))
      phoneDetails.colour mustBe (Some("Rose Gold"))
      phoneDetails.condition mustBe (Some("USED"))
    }

    "leave network as unlocked if it unrecognized" in {
      val listingDetails = testListing.copy(properties = Map("Network" -> "Tele 2"))

      val phoneDetails = PhoneDetailsMapper.from(listingDetails)

      phoneDetails.network mustBe (Some("Unlocked"))
    }

    "replace colour Gray with Grey" in {
      val listingDetails = testListing.copy(properties = Map("Manufacturer Colour" -> "Gray"))

      val phoneDetails = PhoneDetailsMapper.from(listingDetails)

      phoneDetails.colour mustBe (Some("Grey"))
    }

    "leave storage capacity empty if it is in MB" in {
      val listingDetails = testListing.copy(properties = Map("Storage Capacity" -> "128 MB"))

      val phoneDetails = PhoneDetailsMapper.from(listingDetails)

      phoneDetails.storageCapacity mustBe (None)
    }

    "map colour from Colour property if manufacture colour is missing" in {
      val listingDetails = testListing.copy(properties = Map("Colour" -> "Blue Topaz"))

      val phoneDetails = PhoneDetailsMapper.from(listingDetails)

      phoneDetails.colour mustBe (Some("Blue"))
    }

    val faultyDescriptions = List(
      "blah blah has a crack blah",
      "blah blah no touchid blah blah",
      "no touchid",
      "has cracked screen",
      "bla bla touch id doesn't work blah blah",
      "bla bla touch id doesnt work blah blah",
      "bla bla touch id can't work blah blah",
      "blah blah screen is cracked blah blah",
      "blah blah there is a crack blah blah",
      "blah spares/repairs blah",
      "please read \nneeds new screen!. Condition is Used. Dispatched with Royal Mail 1st Class.\n<br>"
    )

    "detect if phone is faulty base on description" in {
      for (description <- faultyDescriptions) {
        val listingDetails = testListing.copy(description = Some(description), shortDescription = None)

        val phoneDetails = PhoneDetailsMapper.from(listingDetails)

        phoneDetails.condition mustBe (Some("Faulty"))
      }
    }

    "detect if phone is faulty base on short description" in {
      for (description <- faultyDescriptions) {
        val listingDetails = testListing.copy(shortDescription = Some(description), description = None)

        val phoneDetails = PhoneDetailsMapper.from(listingDetails)

        phoneDetails.condition mustBe (Some("Faulty"))
      }
    }

    val faultyTitles = List(
      "good but smashed",
      "galaxy s8 smashed screen",
      "iphone for spares repairs",
      "iphone with Cracked Screen",
      "blah spares/repairs blah"
    )

    "detect if phone is faulty based on title" in {
      for (title <- faultyTitles) {
        val listingDetails = testListing.copy(title = title)

        val phoneDetails = PhoneDetailsMapper.from(listingDetails)

        phoneDetails.condition mustBe (Some("Faulty"))
      }
    }
  }
}
