package ebayapp.core.clients.argos

import cats.syntax.functor.*
import io.circe.Codec

private[argos] object responses {

  final case class DataAttributes(
      relevancyRank: Int,
      name: String,
      price: BigDecimal,
      brand: String,
      deliverable: Boolean,
      reservable: Boolean
  ) derives Codec.AsObject

  final case class ArgosItem(
      id: String,
      attributes: DataAttributes
  ) derives Codec.AsObject

  final case class ResponseMeta(
      currentPage: Int,
      totalPages: Int
  ) derives Codec.AsObject {
    val nextPage: Option[Int] = Option.when(currentPage < totalPages)(currentPage + 1)
  }

  final case class SearchResponse(
      meta: ResponseMeta,
      data: List[ArgosItem]
  ) derives Codec.AsObject

  final case class SearchData(response: SearchResponse) derives Codec.AsObject

  final case class ArgosSearchResponse(data: SearchData) derives Codec.AsObject
}
