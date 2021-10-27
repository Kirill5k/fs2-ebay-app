package ebayapp.core.controllers

import ebayapp.core.domain.{ItemDetails, ItemKind, ResellableItem}
import ebayapp.core.domain.search.ListingDetails

object views {

  sealed trait ErrorResponse {
    def message: String
  }

  object ErrorResponse {
    final case class InternalError(message: String) extends ErrorResponse
    final case class BadRequest(message: String) extends ErrorResponse

    def from(err: Throwable): ErrorResponse = InternalError(err.getMessage)
  }

  final case class ItemSummary(
      name: Option[String],
      title: String,
      url: String,
      price: BigDecimal,
      exchange: Option[BigDecimal]
  )

  final case class ItemsSummary(
      total: Int,
      items: List[ItemSummary]
  )

  final case class ResellableItemsSummaryResponse(
      total: Int,
      unrecognized: ItemsSummary,
      profitable: ItemsSummary,
      rest: ItemsSummary
  )

  final case class ItemPrice(
      buy: BigDecimal,
      quantityAvailable: Int,
      sell: Option[BigDecimal],
      credit: Option[BigDecimal]
  )

  final case class ResellableItemResponse(
      kind: ItemKind,
      itemDetails: ItemDetails,
      listingDetails: ListingDetails,
      price: ItemPrice
  )

  object ResellableItemResponse {
    def from(item: ResellableItem): ResellableItemResponse =
      ResellableItemResponse(
        item.kind,
        item.itemDetails,
        item.listingDetails,
        ItemPrice(
          item.buyPrice.rrp,
          item.buyPrice.quantityAvailable,
          item.sellPrice.map(_.cash),
          item.sellPrice.map(_.credit)
        )
      )
  }
}
