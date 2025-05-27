'use client'

import {type ReactNode, createContext, useRef, useContext} from 'react'
import {useStore} from 'zustand'

import {type DealsStore, createDealsStore, initDefaultState} from './state'

export type DealsStoreApi = ReturnType<typeof createDealsStore>

export const DealsStoreContext = createContext<DealsStoreApi | undefined>(undefined)

export interface DealsStoreProviderProps {
  children: ReactNode
}

export const DealsStoreProvider = ({children}: DealsStoreProviderProps) => {
  const storeRef = useRef<DealsStoreApi | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createDealsStore(initDefaultState())
  }

  return <DealsStoreContext value={storeRef.current}>{children}</DealsStoreContext>
}

export const useDealsStore = <T,>(selector: (store: DealsStore) => T): T => {
  const counterStoreContext = useContext(DealsStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useDealsStore must be used within DealsStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
