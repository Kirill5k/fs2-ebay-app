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
      imageAltText: String
  ) derives Codec.AsObject:
    def discount: Option[Int] =
      discountPercentage.flatMap { d =>
        if (d >= 0 && d < 100) Some(d.toInt)
        else d.toString.split("\\.").drop(1).headOption.map(_.substring(0, 2).toInt)
      }

    def isOnSale: Boolean = discount.exists(d => d > 0 && d < 100) && sizes.nonEmpty
    def colour: String    = colourName.replaceFirst(" V[ 0-9]+", "")

  final case class FlannelsSearchResponse(products: List[FlannelsProduct]) derives Codec.AsObject
}
