package kirill5k.ebayapp.domain

import kirill5k.ebayapp.domain.search.SearchQuery

object stock {

  final case class StockMonitorRequest(
      query: SearchQuery,
      monitorStockChange: Boolean = true,
      monitorPriceChange: Boolean = true
  )

  sealed trait StockUpdateType

  object StockUpdateType {
    final case object New extends StockUpdateType {
      override def toString: String = "New in stock"
    }
    final case class PriceDrop(previous: BigDecimal, current: BigDecimal) extends StockUpdateType {
      override def toString: String = s"Price has reduced from £$previous to £$current"
    }
    final case class PriceRaise(previous: BigDecimal, current: BigDecimal) extends StockUpdateType {
      override def toString: String = s"Price has increased from £$previous to £$current"
    }
    final case class StockIncrease(previous: Int, current: Int) extends StockUpdateType {
      override def toString: String = s"Stock quantity has increased from $previous to ${current}"
    }
    final case class StockDecrease(previous: Int, current: Int) extends StockUpdateType {
      override def toString: String = s"Stock quantity has decreased from $previous to $current"
    }
  }

  final case class StockUpdate[D <: ItemDetails](
      updateType: StockUpdateType,
      item: ResellableItem[D]
  )
}
