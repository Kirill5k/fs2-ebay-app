import {useState} from 'react'
import {Filter, ArrowUpDown, ArrowUp, ArrowDown} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {ResellableItem, StockSort} from '@/store/state'

interface FilterAndSortPanelProps {
  items: ResellableItem[]
  sort: StockSort
  onSortChange: (sort: StockSort) => void
}

const FilterAndSortPanel = ({items, sort, onSortChange}: FilterAndSortPanelProps) => {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Sorting & Filtering
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {items.length} items
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sort by:</span>
          </div>
          <div className="flex items-center gap-4">
            <Select value={sort.by} onValueChange={(by) => onSortChange({...sort, by})}>
              <SelectTrigger className="grow-1 md:grow-0 md:w-[180px]">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="datePosted">Date Added</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSortChange({...sort, asc: !sort.asc})}
              className="flex items-center gap-2 h-9"
            >
              {sort.asc ? (
                <>
                  <ArrowUp className="w-4 h-4" />
                  Ascending
                </>
              ) : (
                <>
                  <ArrowDown className="w-4 h-4" />
                  Descending
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"></div>
      </CardContent>
    </Card>
  )
}

export default FilterAndSortPanel
