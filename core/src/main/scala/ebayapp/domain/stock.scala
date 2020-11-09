package ebayapp.domain

object stock {

  sealed trait StockUpdateType {
    def header: String
    def message: String
  }

  object StockUpdateType {
    final case object New extends StockUpdateType {
      override def header: String = "STOCK/NEW"
      override def message: String = "New in stock"
    }
    final case class PriceDrop(previous: BigDecimal, current: BigDecimal) extends StockUpdateType {
      override def message: String = s"Price has reduced from £$previous to £$current"
      override def header: String = "PRICE/DROP"
    }
    final case class PriceRaise(previous: BigDecimal, current: BigDecimal) extends StockUpdateType {
      override def message: String = s"Price has increased from £$previous to £$current"
      override def header: String = "PRICE/INCR"
    }
    final case class StockIncrease(previous: Int, current: Int) extends StockUpdateType {
      override def message: String = s"Stock quantity has increased from $previous to ${current}"
      override def header: String = "STOCK/INCR"
    }
    final case class StockDecrease(previous: Int, current: Int) extends StockUpdateType {
      override def message: String = s"Stock quantity has decreased from $previous to $current"
      override def header: String = "STOCK/DECR"
    }
  }

  final case class StockUpdate[D <: ItemDetails](
      updateType: StockUpdateType,
      item: ResellableItem[D]
  )
}
