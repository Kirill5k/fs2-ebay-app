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

  // Merge identical items with different sizes
  const mergedItems = useMemo(() => {
    // Create a map to group items by their identifying properties
    const itemGroups = new Map<string, ResellableItem[]>()

    items.forEach(item => {
      const key = item.listingDetails.url
      if (!itemGroups.has(key)) {
        itemGroups.set(key, [])
      }
      itemGroups.get(key)!.push(item)
    })

    // Merge items with the same key but different sizes
    return Array.from(itemGroups.values()).map(group => {
      if (group.length === 1) {
        return group[0] // No merging needed
      }

      // Extract all unique sizes
      const sizes = group
        .map(item => item.itemDetails.size)
        .filter((size): size is string => size !== undefined && size !== '')

      const uniqueSizes = [...new Set(sizes)]

      if (uniqueSizes.length <= 1) {
        return group[0] // No different sizes to merge
      }

      // Create a new item with merged sizes
      const mergedItem = {...group[0]}
      mergedItem.itemDetails = {
        ...mergedItem.itemDetails,
        size: uniqueSizes.join(' / '),
      }

      return mergedItem
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
