import {Card, CardContent, CardTitle, CardHeader} from '@/components/ui/card'
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

function summarizeItems(items: ResellableItem[]): RetailerSummary[] {
  // Group items by retailer (seller)
  const retailerMap = new Map<string, ResellableItem[]>();

  for (const item of items) {
    const retailer = item.listingDetails.seller;
    if (!retailerMap.has(retailer)) {
      retailerMap.set(retailer, []);
    }
    retailerMap.get(retailer)!.push(item);
  }

  // Create summary for each retailer
  const summaries: RetailerSummary[] = [];

  for (const [retailer, retailerItems] of retailerMap.entries()) {
    // Group items by brand (foundWith)
    const brandMap = new Map<string, ResellableItem[]>();

    for (const item of retailerItems) {
      const brand = item.foundWith;
      if (!brandMap.has(brand)) {
        brandMap.set(brand, []);
      }
      brandMap.get(brand)!.push(item);
    }

    // Calculate category summaries
    const categories: CategorySummary[] = [];

    for (const [brand, brandItems] of brandMap.entries()) {
      const totalDiscount = brandItems.reduce((sum, item) => sum + (item.price?.discount || 0), 0);
      const avgDiscount = Math.round(totalDiscount / brandItems.length);

      categories.push({
        name: brand,
        items: brandItems.length,
        avgDiscount
      });
    }

    // Sort categories by avgDiscount in descending order
    categories.sort((a, b) => b.avgDiscount - a.avgDiscount);

    // Create retailer summary
    summaries.push({
      retailer,
      totalItems: retailerItems.length,
      categories
    });
  }

  return summaries;
}

const StockSummary = ({items}: {items: ResellableItem[]}) => {

  const stockData = summarizeItems(items);

  const formateName = (name: string) =>
    name
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")

  return (
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
                <div className="space-y-3">
                  {retailer.categories.map((category, catIndex) => (
                      <div key={catIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
  )
}

export default StockSummary