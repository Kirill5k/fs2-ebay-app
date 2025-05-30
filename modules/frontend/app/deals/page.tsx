'use client'

import {useDealsStore} from '@/store/provider'
import {Spinner} from '@/components/ui/spinner'
import DealsTable from "@/components/deals/table";

export default function StockPage() {
  const {deals, dealsFilters} = useDealsStore((state) => state)

  return (
    <main className="flex flex-col gap-4 p-2 md:p-8">

      {deals.loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="large">
              <p className="mt-4 text-muted-foreground">Loading deals...</p>
            </Spinner>
          </div>
      ) : (
          <DealsTable items={deals.items} />
      )}
    </main>
  )
}
