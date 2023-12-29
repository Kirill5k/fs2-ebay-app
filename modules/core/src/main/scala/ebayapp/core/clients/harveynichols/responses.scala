package ebayapp.core.clients.harveynichols

import io.circe.Codec

private[harveynichols] object responses {

  final case class DisplayItem[V, E](value: V, encoded: E) derives Codec.AsObject

  final case class HarveyNicholsProduct(
      id: String,
      name: DisplayItem[String, Option[String]],
      brand: DisplayItem[String, Option[String]],
      price: DisplayItem[String, Double],
      original_price: DisplayItem[String, Double],
      percentage_discount: DisplayItem[String, Double],
      product_brand_url: DisplayItem[String, String],
      _imageurl: DisplayItem[String, Option[String]],
      variant_display_size: DisplayItem[Option[List[String]], Option[String]]
  ) derives Codec.AsObject

  final case class ProductUniverse(products: List[HarveyNicholsProduct]) derives Codec.AsObject

  final case class HarveyNicholsSearchResponse(universe: ProductUniverse) derives Codec.AsObject

  object HarveyNicholsSearchResponse:
    inline def empty: HarveyNicholsSearchResponse = HarveyNicholsSearchResponse(ProductUniverse(Nil))
}
