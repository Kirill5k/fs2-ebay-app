'use client'

import {useDealsStore} from '@/store/provider'
import StockSummary from '@/components/stock/summary'
import DealsSummary from '@/components/deals/summary'

export default function Home() {
  const {stock, deals} = useDealsStore((state) => state)

  return (
    <main className="flex flex-col gap-4 p-2 md:p-8">
      {<StockSummary items={stock.items} />}
      {<DealsSummary items={deals.items} loading={deals.loading} />}
    </main>
  )
}
