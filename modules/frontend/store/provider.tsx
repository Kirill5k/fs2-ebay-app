'use client'

import {type ReactNode, createContext, useRef, useContext} from 'react'
import {useStore} from 'zustand'
import {useInitDealsStore} from "./hooks";

import {type DealsStore, createDealsStore} from './state'

type DealsStoreApi = ReturnType<typeof createDealsStore>

const DealsStoreContext = createContext<DealsStoreApi | undefined>(undefined)

export const DealsStoreProvider = ({children}: {children: ReactNode}) => {
  const storeRef = useRef<DealsStoreApi | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createDealsStore()
  }

  return <DealsStoreContext value={storeRef.current}>{children}</DealsStoreContext>
}

export const useDealsStore = <T,>(selector: (store: DealsStore) => T): T => {
  const storeContext = useContext(DealsStoreContext)

  if (!storeContext) {
    throw new Error(`useDealsStore must be used within DealsStoreProvider`)
  }

  return useStore(storeContext, selector)
}

export const StoreInitializer = () => {
  useInitDealsStore()
  return null
}
