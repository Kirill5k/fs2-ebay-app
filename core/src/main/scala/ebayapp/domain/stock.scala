package ebayapp.domain

import ebayapp.domain.search.BuyPrice

object stock {

  sealed trait StockUpdate {
    def header: String
    def message: String
  }

  object StockUpdate {
    final case object New extends StockUpdate {
      override def header: String  = "STOCK/NEW"
      override def message: String = "New in stock"
    }
    final case class PriceDrop(previous: BigDecimal, current: BigDecimal) extends StockUpdate {
      override def message: String = s"Price has reduced from £$previous to £$current"
      override def header: String  = "PRICE/DROP"
    }
    final case class PriceRaise(previous: BigDecimal, current: BigDecimal) extends StockUpdate {
      override def message: String = s"Price has increased from £$previous to £$current"
      override def header: String  = "PRICE/INCR"
    }
    final case class StockIncrease(previous: Int, current: Int) extends StockUpdate {
      override def message: String = s"Stock quantity has increased from $previous to ${current}"
      override def header: String  = "STOCK/INCR"
    }
    final case class StockDecrease(previous: Int, current: Int) extends StockUpdate {
      override def message: String = s"Stock quantity has decreased from $previous to $current"
      override def header: String  = "STOCK/DECR"
    }

    def priceChanged(prev: BuyPrice, curr: BuyPrice): Option[StockUpdate] = (prev.rrp, curr.rrp) match {
      case (p, c) if p > c => Some(PriceDrop(p, c))
      case (p, c) if p < c => Some(PriceRaise(p, c))
      case _               => None
    }

    def quantityChanged(prev: BuyPrice, curr: BuyPrice): Option[StockUpdate] = (prev.quantityAvailable, curr.quantityAvailable) match {
      case (p, c) if p > c => Some(StockDecrease(p, c))
      case (p, c) if p < c => Some(StockIncrease(p, c))
      case _               => None
    }
  }

  final case class ItemStockUpdates[D <: ItemDetails](
      item: ResellableItem[D],
      updates: List[StockUpdate]
  )
}
