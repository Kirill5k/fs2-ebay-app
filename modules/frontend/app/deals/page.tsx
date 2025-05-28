'use client'

import { useDealsStore } from '@/store/provider'

export default function StockPage() {
  const { deals } = useDealsStore((state) => state)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Deals Information</h1>
      {deals.loading ? (
        <p>Loading deals data...</p>
      ) : (
        <p>Deals</p>
      )}
    </div>
  )
}