'use client'

import { useDealsStore } from '@/store/provider'

export default function StockPage() {
  const { stock } = useDealsStore((state) => state)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Stock Information</h1>
      {stock.loading ? (
        <p>Loading stock data...</p>
      ) : (
        <p>Stock</p>
      )}
    </div>
  )
}