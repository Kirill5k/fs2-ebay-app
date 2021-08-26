package ebayapp.core.clients.nvidia

private[nvidia] object responses {

  private[nvidia] final case class NvidiaItem(
      productTitle: String,
      imageURL: String,
      category: String,
      retailer: ProductRetailer
  ) {
    val name: String = s"$productTitle (${retailer.partnerId}/${retailer.storeId})"
  }

  private[nvidia] final case class ProductRetailer(
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

  private[nvidia] final case class Product(
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

  private[nvidia] final case class SearchedProducts(productDetails: List[Product])

  private[nvidia] final case class NvidiaSearchResponse(searchedProducts: SearchedProducts)
}
