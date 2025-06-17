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

  const mergedItems = useMemo(() => {
    const itemGroups = items.reduce((map, item) => {
      const key = item.listingDetails.url
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(item)
      return map
    }, new Map<string, ResellableItem[]>())

    return Array.from(itemGroups.values()).map((group) => {
      if (group.length === 1) return group[0]

      const sizes = [...new Set(group.map((item) => item.itemDetails.size).filter(Boolean))]

      if (sizes.length <= 1) return group[0]

      return {
        ...group[0],
        itemDetails: {
          ...group[0].itemDetails,
          size: sizes.join(' / '),
        },
      }
    })
  }, [items])

  const totalPages = Math.ceil(mergedItems.length / itemsPerPage)

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return mergedItems.slice(startIndex, startIndex + itemsPerPage)
  }, [mergedItems, currentPage, itemsPerPage])

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
  }, [mergedItems.length])

  return (
    <div className="space-y-6">
      <PaginationHeader
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={mergedItems.length}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.listingDetails.url}
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
