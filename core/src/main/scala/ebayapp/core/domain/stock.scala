package ebayapp.core.domain

import ebayapp.core.domain.search.BuyPrice

object stock {

  enum StockUpdate(val header: String, val message: String):
    case New extends StockUpdate("STOCK/NEW", "New in stock")
    case OutOfStock extends StockUpdate("STOCK/OOS", "Out of stock")
    case PriceDrop(previous: BigDecimal, current: BigDecimal)
        extends StockUpdate("PRICE/DROP", s"Price has reduced from £$previous to £$current")
    case PriceRaise(previous: BigDecimal, current: BigDecimal)
        extends StockUpdate("PRICE/INCR", s"Price has increased from £$previous to £$current")
    case StockIncrease(previous: Int, current: Int)
        extends StockUpdate("STOCK/INCR", s"Stock quantity has increased from $previous to ${current}")
    case StockDecrease(previous: Int, current: Int)
        extends StockUpdate("STOCK/DECR", s"Stock quantity has decreased from $previous to $current")

  object StockUpdate:
    def priceChanged(prev: BuyPrice, curr: BuyPrice): Option[StockUpdate] =
      (prev.rrp, curr.rrp) match
        case (p, c) if p > c => Some(PriceDrop(p, c))
        case (p, c) if p < c => Some(PriceRaise(p, c))
        case _               => None

    def quantityChanged(prev: BuyPrice, curr: BuyPrice): Option[StockUpdate] =
      (prev.quantityAvailable, curr.quantityAvailable) match
        case (p, 0) if p > 0 => Some(OutOfStock)
        case (p, c) if p > c => Some(StockDecrease(p, c))
        case (p, c) if p < c => Some(StockIncrease(p, c))
        case _               => None

  final case class ItemStockUpdates(
      item: ResellableItem,
      updates: List[StockUpdate]
  )
}
