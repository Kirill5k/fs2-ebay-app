'use client'

import {useEffect} from 'react'
import {useDealsStore} from './provider'

export const useInitDealsStore = () => {
  const deals = useDealsStore((store) => store.deals)
  const stock = useDealsStore((store) => store.stock)
  const fetchDeals = useDealsStore((store) => store.fetchDeals)
  const fetchStock = useDealsStore((store) => store.fetchStock)

  useEffect(() => {
    if (!deals.loading) {
      fetchDeals()
    }
    if (!stock.loading) {
      fetchStock()
    }
  }, [])
}
