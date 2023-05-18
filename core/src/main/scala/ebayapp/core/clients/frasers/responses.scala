package ebayapp.core.clients.frasers

import io.circe.Codec

private[frasers] object responses {

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
    def isOnSale: Boolean = discountPercentage.exists(d => d > 0 && d < 100) && sizes.nonEmpty
    def colour: String = colourName.replaceFirst(" V[ 0-9]+", "")

  final case class FlannelsSearchResponse(products: List[FlannelsProduct]) derives Codec.AsObject
}
