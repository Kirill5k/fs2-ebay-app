'use client'

import {useEffect} from 'react'
import {useDealsStore} from './provider'

export const useInitDealsStore = () => {
  const {deals, stock, fetchDeals, fetchStock} = useDealsStore((store) => store)

  useEffect(() => {
    if (!deals.loading) {
      fetchDeals()
    }
    if (!stock.loading) {
      fetchStock()
    }
  }, [])
}
