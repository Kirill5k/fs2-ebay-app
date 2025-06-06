import {Card, CardContent, CardTitle, CardDescription, CardHeader} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {ResellableItem} from '@/store/state'


interface CategorySummary {
  name: string;
  items: number;
  avgDiscount: number;
}

interface RetailerSummary {
  retailer: string;
  totalItems: number;
  categories: CategorySummary[];
}

function groupItemsBy(items: ResellableItem[], keyGetter: (item: ResellableItem) => string): Map<string, ResellableItem[]> {
  return items.reduce((map, item) => {
    const key = keyGetter(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
    return map;
  }, new Map<string, ResellableItem[]>());
}

function createRetailerSummaries(retailerGroups: Map<string, ResellableItem[]>): RetailerSummary[] {
  return Array.from(retailerGroups.entries()).map(([retailer, retailerItems]) => {
    const brandGroups = groupItemsBy(retailerItems, item => item.foundWith);
    const categories = createCategorySummaries(brandGroups);

    return {
      retailer,
      totalItems: retailerItems.length,
      categories
    };
  });
}

function createCategorySummaries(brandGroups: Map<string, ResellableItem[]>): CategorySummary[] {
  const categories = Array.from(brandGroups.entries()).map(([brand, brandItems]) => {
    const totalDiscount = brandItems.reduce((sum, item) => sum + (item.price?.discount || 0), 0);
    const avgDiscount = Math.round(totalDiscount / brandItems.length);

    return {
      name: brand,
      items: brandItems.length,
      avgDiscount
    };
  });

  return categories.sort((a, b) => b.avgDiscount - a.avgDiscount);
}

const StockSummary = ({items}: {items: ResellableItem[]}) => {
  const retailerGroups = groupItemsBy(items, item => item.listingDetails.seller);
  const stockData = createRetailerSummaries(retailerGroups);

  const formateName = (name: string) =>
    name
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")

  const totalItems = stockData.reduce((sum, retailer) => sum + retailer.totalItems, 0);

  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Stock</span>
            <Badge variant="secondary">{totalItems} items</Badge>
          </CardTitle>
          <CardDescription>
            Stock breakdown by retailer with average discounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {stockData.map((retailer, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {retailer.retailer}
                      <Badge variant="secondary">{retailer.totalItems} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {retailer.categories.map((category, catIndex) => (
                          <div key={catIndex} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{formateName(category.name)}</div>
                              <div className="text-sm text-gray-500">{category.items} items</div>
                            </div>
                            {category.avgDiscount > 0 && <div className="text-right">
                              <Badge
                                  variant={category.avgDiscount >= 60 ? "default" : "secondary"}
                                  className={category.avgDiscount >= 60 ? "bg-green-500" : ""}
                              >
                                {category.avgDiscount}% off
                              </Badge>
                            </div>}
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}

export default StockSummary