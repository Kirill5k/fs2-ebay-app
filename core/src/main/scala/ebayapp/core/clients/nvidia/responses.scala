package ebayapp.core.clients.nvidia

object responses {

  final case class NvidiaRetailerItem(
      productId: Long,
      productTitle: String,
      salePrice: BigDecimal,
      purchaseLink: String,
      directPurchaseLink: Option[String],
      retailerName: String,
      stock: Int
  )

  final case class NvidiaItem(
      productTitle: String,
      productID: Long,
      imageURL: String,
      prdStatus: String,
      productPrice: String,
      category: String,
      retailers: List[NvidiaRetailerItem]
  ) {
    val isOutOfStock: Boolean = prdStatus == "out_of_stock"
  }

  final case class SearchedProducts(productDetails: List[NvidiaItem])

  final case class NvidiaSearchResponse(searchedProducts: SearchedProducts)
}
