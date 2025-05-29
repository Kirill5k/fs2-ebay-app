import {Filter, ArrowUpDown, ArrowUp, ArrowDown} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {MultiSelect} from '@/components/ui/multi-select'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Card} from '@/components/ui/card'
import {ResellableItem, StockSort, StockFilters} from '@/store/state'
import {capitalize} from "@/lib/utils/strings";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"


interface FilterAndSortPanelProps {
  items: ResellableItem[]
  filters: StockFilters
  sort: StockSort
  onSortChange: (sort: StockSort) => void
  onFiltersChange: (sort: StockFilters) => void
}

const extractOptions = (items: ResellableItem[], key: (i: ResellableItem) => string, labelMod: (l: string) => string = l => l) => {
  const rawOptions = Array.from(new Set(items.map(key).filter(Boolean))).sort()
  return rawOptions.map(l => ({label: labelMod(l), value: l}))
}

const FilterAndSortPanel = ({items, sort, onSortChange, filters, onFiltersChange}: FilterAndSortPanelProps) => {
  const includesClothing = items.some(i => i.itemDetails.kind === 'clothing')
  const showClothingFilters = includesClothing && (filters.kind.length === 0 || filters.kind.includes('clothing'))

  const kindOptions = extractOptions(items, i => i.itemDetails.kind, capitalize)
  const selectedKinds = filters.kind.map(k => ({label: capitalize(k), value: k}))
  const handleKindChange = (selected: {label: string, value: string}[]) => {
    const kind = selected.map(s => s.value)
    const resetClothingFilters = showClothingFilters && kind.length > 0 && !kind.includes('clothing')
    onFiltersChange({...filters, kind, brand: resetClothingFilters ? [] : filters.brand})
  }

  const retailerOptions = extractOptions(items, i => i.listingDetails.seller)
  const selectedRetailers = filters.retailer.map(r => ({label: r, value: r}))
  const handleRetailerChange = (selected: {label: string, value: string}[]) => {
    onFiltersChange({...filters, retailer: selected.map(s => s.value)})
  }

  const brandOptions = extractOptions(items, i => i.itemDetails?.brand || '')
  const selectedBrands = filters.brand.map(b => ({label: b, value: b}))
  const handleBrandChange = (selected: {label: string, value: string}[]) => {
    onFiltersChange({...filters, brand: selected.map(s => s.value)})
  }

  const sizeOptions = extractOptions(items, i => i.itemDetails?.size || '')
  const selectedSizes = filters.size.map(s => ({label: s, value: s}))
  const handleSizeChange = (selected: {label: string, value: string}[]) => {
    onFiltersChange({...filters, size: selected.map(s => s.value)})
  }

  return (
    <Card className="overflow-hidden py-0">
      <Accordion type="single" defaultValue="filters" collapsible>
        <AccordionItem value="filters" className="border-0">
          <AccordionTrigger className="p-4 hover:no-underline flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <span className="font-semibold">Sorting & Filtering</span>
              </div>
              <Badge variant="secondary" className="text-sm">
                {items.length} items
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="space-y-4">
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
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="datePosted">Date Added</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSortChange({...sort, asc: !sort.asc})}
                    className="flex items-center justify-start gap-2 h-9 w-32"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MultiSelect
                    placeholder="Kind"
                    options={kindOptions}
                    value={selectedKinds}
                    onChange={handleKindChange}
                />

                <MultiSelect
                  placeholder="Retailer"
                  options={retailerOptions}
                  value={selectedRetailers}
                  onChange={handleRetailerChange}
                />

                {showClothingFilters && (
                    <MultiSelect
                        placeholder="Brand"
                        options={brandOptions}
                        value={selectedBrands}
                        onChange={handleBrandChange}
                    />
                )}

                {showClothingFilters && (
                    <MultiSelect
                        placeholder="Size"
                        options={sizeOptions}
                        value={selectedSizes}
                        onChange={handleSizeChange}
                    />
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default FilterAndSortPanel
