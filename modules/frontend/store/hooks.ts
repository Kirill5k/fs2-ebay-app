'use client'

import {useEffect} from 'react'
import {useDealsStore} from './provider'

export const useInitDealsStore = () => {
  const {fetchDeals, fetchStock} = useDealsStore((store) => store)

  useEffect(() => {
    fetchDeals()
    fetchStock()
  }, [])
}
