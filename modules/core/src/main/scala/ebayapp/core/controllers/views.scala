package ebayapp.core.controllers

import ebayapp.core.domain.{ItemDetails, ItemSummary, ResellableItem}
import ebayapp.core.domain.search.ListingDetails
import io.circe.{Codec, Encoder}

object views {

  final case class ItemsSummary(
      total: Int,
      items: List[ItemSummary]
  ) derives Codec.AsObject

  final case class ResellableItemsSummaryResponse(
      total: Int,
      unrecognized: ItemsSummary,
      profitable: ItemsSummary,
      rest: ItemsSummary
  ) derives Codec.AsObject

  object ResellableItemsSummaryResponse {
    def from(summaries: List[ItemSummary]): ResellableItemsSummaryResponse = {
      val (worp, prof, rest) = summaries.foldLeft((List.empty[ItemSummary], List.empty[ItemSummary], List.empty[ItemSummary])) {
        case ((withoutResell, profitable, rest), item) =>
          if (item.exchangePrice.isEmpty) (item :: withoutResell, profitable, rest)
          else if (item.exchangePrice.exists(ep => ep > item.buyPrice)) (withoutResell, item :: profitable, rest)
          else (withoutResell, profitable, item :: rest)
      }

      ResellableItemsSummaryResponse(
        summaries.size,
        ItemsSummary(worp.size, worp.reverse),
        ItemsSummary(prof.size, prof.reverse),
        ItemsSummary(rest.size, rest.reverse)
      )
    }
  }

  final case class ItemPrice(
      buy: BigDecimal,
      discount: Option[Int],
      quantityAvailable: Int,
      sell: Option[BigDecimal],
      credit: Option[BigDecimal]
  ) derives Codec.AsObject

  final case class ResellableItemView(
      itemDetails: ItemDetails,
      listingDetails: ListingDetails,
      price: ItemPrice,
      foundWith: String
  ) derives Codec.AsObject

  object ResellableItemView {
    def from(item: ResellableItem): ResellableItemView =
      ResellableItemView(
        item.itemDetails,
        item.listingDetails,
        ItemPrice(
          item.buyPrice.rrp,
          item.buyPrice.discount,
          item.buyPrice.quantityAvailable,
          item.sellPrice.map(_.cash),
          item.sellPrice.map(_.credit)
        ),
        item.foundWith.query
      )
  }
}