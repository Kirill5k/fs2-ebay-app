package ebayapp.core.clients.harveynichols

import io.circe.Codec

private[harveynichols] object responses {

  final case class PriceItem(value: String, encoded: Double) derives Codec.AsObject
  final case class NameItem(value: String, encoded: Option[String]) derives Codec.AsObject
  final case class SizeItem(value: Option[List[String]], encoded: Option[String]) derives Codec.AsObject

  final case class HarveyNicholsProduct(
      id: String,
      name: NameItem,
      brand: NameItem,
      price: PriceItem,
      original_price: PriceItem,
      percentage_discount: PriceItem,
      product_brand_url: NameItem,
      _imageurl: NameItem,
      variant_display_size: SizeItem
  ) derives Codec.AsObject

  final case class ProductUniverse(products: List[HarveyNicholsProduct]) derives Codec.AsObject

  final case class HarveyNicholsSearchResponse(universe: ProductUniverse) derives Codec.AsObject

  object HarveyNicholsSearchResponse:
    inline def empty: HarveyNicholsSearchResponse = HarveyNicholsSearchResponse(ProductUniverse(Nil))
}
