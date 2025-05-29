'use client'

import {useDealsStore} from '@/store/provider'
import FilterAndSortPanel from '@/components/stock/filters'
import StockList from '@/components/stock/list'

export default function StockPage() {
  const {stock, stockSort, setStockSort, stockFilters, setStockFilters} = useDealsStore((state) => state)

  return (
    <main className="flex flex-col gap-4 p-2 md:p-8">
      <FilterAndSortPanel
        items={stock.items}
        sort={stockSort}
        onSortChange={setStockSort}
        filters={stockFilters}
        onFiltersChange={setStockFilters}
      />
      <StockList items={stock.items} />
    </main>
  )
}
