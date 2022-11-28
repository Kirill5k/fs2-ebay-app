package ebayapp.core.clients.flannels

import io.circe.Codec

private[flannels] object responses {

  final case class FlannelsProduct(
      url: String,
      imageLarge: Option[String],
      productId: String,
      brand: String,
      name: String,
      priceUnFormatted: BigDecimal,
      discountPercentage: Option[BigDecimal],
      sizes: String,
      colourName: String,
      imageAltText: String,
  ) derives Codec.AsObject:
    def isOnSale: Boolean = discountPercentage.exists(_ > 5) && sizes.nonEmpty
    def colour: String = colourName.replaceFirst(" V\\d+", "")

  final case class FlannelsSearchResponse(products: List[FlannelsProduct]) derives Codec.AsObject
}
