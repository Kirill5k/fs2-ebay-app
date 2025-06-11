import {Card, CardContent, CardTitle, CardDescription, CardHeader} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {ResellableItem} from '@/store/state'

interface QuerySummary {
  retailer: string
  query: string
  totalItems: number
  itemsWithoutSellPrice: number
  profitableItems: number
}

function summarizeItems(items: ResellableItem[]): QuerySummary[] {
  // Group items by retailer and query
  const groupMap = new Map<string, Map<string, ResellableItem[]>>()

  for (const item of items) {
    // Handle retailer name - split on ":" if present
    let retailer = item.listingDetails.seller
    if (retailer.includes(':')) {
      retailer = retailer.split(':')[0].trim()
    }

    const query = item.foundWith

    // Initialize nested maps if needed
    if (!groupMap.has(retailer)) {
      groupMap.set(retailer, new Map<string, ResellableItem[]>())
    }

    if (!groupMap.get(retailer)!.has(query)) {
      groupMap.get(retailer)!.set(query, [])
    }

    // Add item to appropriate group
    groupMap.get(retailer)!.get(query)!.push(item)
  }

  // Create summaries
  const summaries: QuerySummary[] = []

  for (const [retailer, queryMap] of groupMap.entries()) {
    for (const [query, queryItems] of queryMap.entries()) {
      const itemsWithoutSellPrice = queryItems.filter((item) => item.price.sell === null).length
      const profitableItems = queryItems.filter((item) => item.price.sell !== null && item.price.sell > item.price.buy).length

      summaries.push({
        retailer,
        query,
        totalItems: queryItems.length,
        itemsWithoutSellPrice,
        profitableItems,
      })
    }
  }

  return summaries
}

const DealsSummary = ({items}: {items: ResellableItem[]}) => {
  const dealsData = summarizeItems(items)

  const totalItems = dealsData.reduce((sum, deal) => sum + deal.totalItems, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deals Found Today</span>
          <Badge variant="secondary">{totalItems} items</Badge>
        </CardTitle>
        <CardDescription>Summary of profitable deals found by retailer and search query</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {dealsData.map((deal, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 text-lg">{deal.retailer}</span>
                  <Badge
                    variant="outline"
                    className="font-medium"
                  >
                    {deal.query}
                  </Badge>
                </div>
                <Badge variant="secondary">{deal.totalItems} items</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-700">{deal.itemsWithoutSellPrice}</div>
                  <div className="text-sm text-gray-500">No sell price</div>
                  <div className="text-xs text-gray-400 mt-1">
                    ({deal.totalItems > 0 ? Math.round((deal.itemsWithoutSellPrice / deal.totalItems) * 100) : 0}%)
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-700">{deal.profitableItems}</div>
                  <div className="text-sm text-green-600">Profitable</div>
                  <div className="text-xs text-green-500 mt-1">
                    ({deal.totalItems > 0 ? Math.round((deal.profitableItems / deal.totalItems) * 100) : 0}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DealsSummary
