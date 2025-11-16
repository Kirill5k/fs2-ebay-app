package ebayapp.core.clients.ebay.mappers

import ebayapp.core.domain.search.ListingDetails
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import java.time.Instant

class ElectronicsDetailsMapperSpec extends AnyWordSpec with Matchers {

  val testListing = ListingDetails(
    url = "https://www.ebay.co.uk/itm/357777714939",
    title = "Genuine AirPods Pro Max Headphones Space Grey - Excellent Used Condition",
    category = Some("Headphones"),
    shortDescription = Some("Always kept in case Excellent condition Has minor general signs of use"),
    description = Some("Always kept in case Excellent condition Has minor general signs of use Can provide proof of purchase"),
    image = Some("https://i.ebayimg.com/images/g/ZdQAAeSwhk9o9LbZ/s-l1600.jpg"),
    condition = "USED",
    datePosted = Instant.parse("2025-10-19T10:01:58.000Z"),
    seller = "EBAY:billy7619",
    properties = Map(
      "Brand"      -> "Apple",
      "Model"      -> "Apple AirPods Max",
      "Colour"     -> "Grey",
      "CategoryId" -> "112529",
      "Price"      -> "406.52",
      "Currency"   -> "GBP",
      "Postage"    -> "4.26"
    )
  )

  "ElectronicsDetailsMapper" should {

    "map listing details details to electronics item details" in {
      val result = ElectronicsDetailsMapper.from(testListing)

      result.brand mustBe Some("Apple")
      result.model mustBe Some("Apple AirPods Max")
      result.colour mustBe Some("Grey")
      result.condition mustBe Some("USED")
    }
  }
}
