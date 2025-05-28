'use client';

import {useEffect} from "react"
import {useDealsStore} from "./provider";

export const useInitDealsStore = () => {
  const fetchDeals = useDealsStore(store => store.fetchDeals)
  const fetchStock = useDealsStore(store => store.fetchStock)

  // For initialization
  useEffect(() => {
    // Load initial data
    fetchDeals()
    fetchStock()
  }, [fetchDeals, fetchStock])
}