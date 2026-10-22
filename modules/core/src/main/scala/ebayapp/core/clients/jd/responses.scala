package ebayapp.core.clients.jd

import io.circe.Decoder

private[jd] object responses {

  final case class JdAlgoliaProduct(
      objectID: String,
      name: String,
      brand: Option[List[String]],
      colour: Option[String],
      size: Option[List[String]],
      categoryPageId: List[String],
      price: BigDecimal,
      wasPrice: Option[BigDecimal],
      image: String,
      slug: String,
      inStock: Boolean
  ) derives Decoder {
    def isOnSale: Boolean = wasPrice.exists(_ > price)

    def rootCategories: List[String] = categoryPageId.map(_.trim).filter(c => c.nonEmpty && !c.contains(">"))

    def cleanImageUrl: String = {
      val queryIndex = image.lastIndexOf("?")
      val cleanUrl = if (queryIndex != -1) image.substring(0, queryIndex) else image
      cleanUrl + ".jpeg"
    }
  }

  final case class JdAlgoliaSearchResponse(
      hits: List[JdAlgoliaProduct],
      page: Int,
      nbPages: Int
  ) derives Decoder
}
