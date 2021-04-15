package ebayapp.core.clients.argos

import cats.implicits._

 object responses {

  final case class DataAttributes(
      relevancyRank: Int,
      name: String,
      price: BigDecimal,
      brand: String,
      deliverable: Boolean,
      reservable: Boolean
  )

  final case class ArgosItem(
      id: String,
      attributes: DataAttributes
  )

  final case class ResponseMeta(
      currentPage: Int,
      totalPages: Int
  ) {
    val nextPage: Option[Int] = (currentPage < totalPages).guard[Option].as(currentPage + 1)
  }

  final case class SearchResponse(
      meta: ResponseMeta,
      data: List[ArgosItem]
  )

  final case class SearchData(response: SearchResponse)

  final case class ArgosSearchResponse(data: SearchData)
}
