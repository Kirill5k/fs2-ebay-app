package kirill5k.ebayapp.resellables

final case class StockMonitorRequest(
    query: SearchQuery,
    monitorStockChange: Boolean = true,
    monitorPriceChange: Boolean = true
)
