import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'

interface PaginationHeaderProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  onItemsPerPageChange: (value: string) => void
}

const PaginationHeader = ({currentPage, itemsPerPage, totalItems, onItemsPerPageChange}: PaginationHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2 p-2 pb-0">
      <p className="text-sm text-gray-600">
        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Items per page:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={onItemsPerPageChange}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PaginationHeader
