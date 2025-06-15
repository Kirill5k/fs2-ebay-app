'use client'

import {useState, useMemo, useEffect} from 'react'
import {Separator} from '@/components/ui/separator'
import {ResellableItem} from '@/store/state'
import PaginationFooter from '@/components/common/pagination/footer'
import PaginationHeader from '@/components/common/pagination/header'
import ProductCard from './card'

interface StockListProps {
  items: ResellableItem[]
}

const StockList = ({items}: StockListProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [items, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  useEffect(() => {
    handlePageChange(1)
  }, [items.length])

  return (
    <div className="space-y-6">
      <PaginationHeader
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={items.length}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {paginatedProducts.map((product, index) => (
          <ProductCard
            key={`${product.itemDetails.name}-${index}`}
            product={product}
          />
        ))}
      </div>

      {totalPages > 1 && <Separator />}

      {totalPages > 1 && (
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default StockList
