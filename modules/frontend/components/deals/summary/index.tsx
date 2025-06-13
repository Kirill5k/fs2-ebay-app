import {Card, CardContent, CardTitle, CardDescription, CardHeader} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {ResellableItem} from '@/store/state'
import { useMemo } from 'react'

interface QuerySummary {
  retailer: string
  query: string
  totalItems: number
  itemsWithoutSellPrice: number
  profitableItems: number
}

function summarizeItems(items: ResellableItem[]): QuerySummary[] {
  // Helper function to extract retailer name
  const getRetailerName = (item: ResellableItem): string => {
    const seller = item.listingDetails.seller;
    return seller.includes(':') ? seller.split(':')[0].trim() : seller;
  };

  // Group items by retailer and query
  const groupedItems = items.reduce<Record<string, Record<string, ResellableItem[]>>>((acc, item) => {
    const retailer = getRetailerName(item);
    const query = item.foundWith;

    // Initialize nested objects if needed
    if (!acc[retailer]) {
      acc[retailer] = {};
    }

    if (!acc[retailer][query]) {
      acc[retailer][query] = [];
    }

    acc[retailer][query].push(item);
    return acc;
  }, {});

  // Create summaries from grouped items
  return Object.entries(groupedItems).flatMap(([retailer, queryMap]) =>
    Object.entries(queryMap).map(([query, queryItems]) => ({
      retailer,
      query,
      totalItems: queryItems.length,
      itemsWithoutSellPrice: queryItems.filter(item => item.price.sell === null).length,
      profitableItems: queryItems.filter(item => item.price.sell !== null && item.price.sell > item.price.buy).length
    }))
  );
}

const DealsSummary = ({items}: {items: ResellableItem[]}) => {
  const dealsData = useMemo(() => summarizeItems(items), [items])

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
