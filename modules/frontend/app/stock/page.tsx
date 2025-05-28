'use client'

import {useDealsStore} from '@/store/provider'
import FilterAndSortPanel from '@/components/stock/filters'

export default function StockPage() {
  const {stock, stockSort, setStockSort} = useDealsStore((state) => state)

  return (
    <main className="p-2 md:p-8">
      <FilterAndSortPanel items={stock.items} sort={stockSort} onSortChange={setStockSort} />
    </main>
  )
}
