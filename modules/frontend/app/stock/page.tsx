'use client'

import {useDealsStore} from '@/store/provider'
import FilterAndSortPanel from '@/components/stock/filters'
import StockList from '@/components/stock/list'
import {ResellableItem} from '@/store/state'
import {Spinner} from '@/components/ui/spinner'

export default function StockPage() {
  const {stock, stockSort, setStockSort, stockFilters, setStockFilters} = useDealsStore((state) => state)

  const isLoading = stock.loading

  const filteredItems = stock.items.filter(
    (item) =>
      (stockFilters.kind.length === 0 || stockFilters.kind.includes(item.itemDetails.kind)) &&
      (stockFilters.retailer.length === 0 || stockFilters.retailer.includes(item.listingDetails.seller)) &&
      (stockFilters.brand.length === 0 || stockFilters.brand.includes(item.itemDetails.brand || '')) &&
      (stockFilters.size.length === 0 || stockFilters.size.includes(item.itemDetails.size || '')) &&
      (stockFilters.minPrice === undefined || item.price.buy >= stockFilters.minPrice) &&
      (stockFilters.maxPrice === undefined || item.price.buy <= stockFilters.maxPrice) &&
      (stockFilters.minDiscount === undefined || (item.price.discount && item.price.discount >= stockFilters.minDiscount))
  )

  const filteredAndSortedItems = filteredItems.sort((a: ResellableItem, b: ResellableItem): number => {
    switch (stockSort.by) {
      case 'price':
        return stockSort.asc ? a.price.buy - b.price.buy : b.price.buy - a.price.buy
      case 'discount':
        const aDiscount = a.price.discount || 0
        const bDiscount = b.price.discount || 0
        return stockSort.asc ? aDiscount - bDiscount : bDiscount - aDiscount
      case 'retailer':
        return stockSort.asc
          ? a.listingDetails.seller.localeCompare(b.listingDetails.seller)
          : b.listingDetails.seller.localeCompare(a.listingDetails.seller)
      case 'name':
        return stockSort.asc ? a.itemDetails.name.localeCompare(b.itemDetails.name) : b.itemDetails.name.localeCompare(a.itemDetails.name)
      default:
        return stockSort.asc
          ? new Date(a.listingDetails.datePosted).getTime() - new Date(b.listingDetails.datePosted).getTime()
          : new Date(b.listingDetails.datePosted).getTime() - new Date(a.listingDetails.datePosted).getTime()
    }
  })

  const handleClearFilters = () => {
    setStockFilters({
      kind: [],
      retailer: [],
      brand: [],
      size: [],
      minPrice: undefined,
      maxPrice: undefined,
      minDiscount: undefined,
    })
  }

  return (
    <main className="flex flex-col gap-4 p-2 md:p-8">
      <FilterAndSortPanel
        filters={stockFilters}
        onFiltersChange={setStockFilters}
        sort={stockSort}
        onSortChange={setStockSort}
        items={stock.items}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="large">
            <p className="mt-4 text-muted-foreground">Loading stock items...</p>
          </Spinner>
        </div>
      ) : (
        <StockList items={filteredAndSortedItems} />
      )}
    </main>
  )
}
