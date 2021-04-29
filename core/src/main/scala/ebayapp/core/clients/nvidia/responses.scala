package ebayapp.core.clients.nvidia

object responses {

  final case class NvidiaItem(
      productTitle: String,
      imageURL: String,
      category: String,
      retailer: ProductRetailer
  ) {
    val name: String = s"$productTitle (${retailer.partnerId}/${retailer.storeId})"
  }

  final case class ProductRetailer(
      productId: Long,
      productTitle: String,
      salePrice: BigDecimal,
      purchaseLink: String,
      directPurchaseLink: Option[String],
      retailerName: String,
      stock: Int,
      partnerId: String,
      storeId: String
  )

  final case class Product(
      productTitle: String,
      productID: Long,
      imageURL: String,
      prdStatus: String,
      productPrice: String,
      category: String,
      retailers: List[ProductRetailer]
  ) {
    val isOutOfStock: Boolean = prdStatus == "out_of_stock"
  }

  final case class SearchedProducts(productDetails: List[Product])

  final case class NvidiaSearchResponse(searchedProducts: SearchedProducts)
}
