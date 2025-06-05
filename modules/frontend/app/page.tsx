'use client'

import {useDealsStore} from '@/store/provider'
import StockSummary from '@/components/stock/summary'

export default function Home() {
  const {dealsFilters, stock} = useDealsStore((state) => state)

  return (
      <main className="flex flex-col gap-4 p-2 md:p-8">
        {!stock.loading && (
            <StockSummary items={stock.items} />
        )}
      </main>
  )
}
