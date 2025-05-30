'use client'

import {useDealsStore} from '@/store/provider'

export default function StockPage() {
  const {deals, dealsFilters} = useDealsStore((state) => state)

  return (
    <main className="flex flex-col gap-4 p-2 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Deals Information</h1>
      {deals.loading ? <p>Loading deals data...</p> : <p>Deals</p>}
    </main>
  )
}
