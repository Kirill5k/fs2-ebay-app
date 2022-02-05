package ebayapp.core.clients.mainlinemenswear

import io.circe.Codec

private[mainlinemenswear] object responses {

  final case class ProductSize(content: String, onlinestock: Int) derives Codec.AsObject

  final case class ProductSizes(data: List[ProductSize]) derives Codec.AsObject

  final case class ProductData(
      productID: Long,
      name: String,
      brand: String,
      category: String,
      base_price: BigDecimal,
      rrp: BigDecimal,
      sizes: ProductSizes,
      clean_url: String,
      mainimage: String
  ) derives Codec.AsObject

  final case class ProductResponse(data: ProductData) derives Codec.AsObject

  final case class ProductPreview(
      productID: Long,
      name: String,
      brand: String,
      base_price: BigDecimal,
      rrp: BigDecimal
  ) derives Codec.AsObject {
    def isOnSale: Boolean = base_price > 0 && rrp > 0
  }

  final case class SearchData(products: List[ProductPreview]) derives Codec.AsObject

  final case class SearchResponse(data: SearchData) derives Codec.AsObject
}
