package ebayapp.core.clients.nvidia

import io.circe.Codec

private[nvidia] object responses {

  final private[nvidia] case class NvidiaItem(
      productTitle: String,
      imageURL: String,
      category: String,
      retailer: ProductRetailer
  ) {
    val name: String = s"$productTitle (${retailer.partnerId}/${retailer.storeId})"
  }

  final private[nvidia] case class ProductRetailer(
      isAvailable: Boolean,
      productId: Long,
      productTitle: String,
      salePrice: BigDecimal,
      purchaseLink: String,
      directPurchaseLink: Option[String],
      retailerName: String,
      stock: Int,
      partnerId: String,
      storeId: String
  ) derives Codec.AsObject

  final private[nvidia] case class Product(
      displayName: String,
      productTitle: String,
      productID: Long,
      imageURL: String,
      prdStatus: String,
      productPrice: String,
      category: String,
      retailers: List[ProductRetailer]
  ) derives Codec.AsObject

  final private[nvidia] case class SearchedProducts(featuredProduct: Option[Product], productDetails: List[Product]) derives Codec.AsObject

  final private[nvidia] case class NvidiaSearchResponse(searchedProducts: SearchedProducts) derives Codec.AsObject
}
