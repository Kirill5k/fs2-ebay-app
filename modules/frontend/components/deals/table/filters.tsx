import React, {useMemo} from 'react'
import {FilterIcon} from 'lucide-react'
import {MultiSelect, Option} from '@/components/ui/multi-select'
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from '@/components/ui/dropdown-menu'
import {ResellableItem} from '@/store/state'
import {VisibilityState} from '@tanstack/react-table'

export type FilterType = 'none' | 'noSellPrice' | 'sellGreaterThanBuy'

export const filterFunctions: Record<FilterType, (items: ResellableItem[]) => ResellableItem[]> = {
  none: (items) => items,
  noSellPrice: (items) => items.filter((item) => item.price.sell === null),
  sellGreaterThanBuy: (items) => items.filter((item) => item.price.sell !== null && item.price.sell > item.price.buy),
}

export const filterOptions = [
  {label: 'No filters', value: 'none'},
  {label: 'Without sell price', value: 'noSellPrice'},
  {label: 'Sell price > Buy price', value: 'sellGreaterThanBuy'},
]

interface TableFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  columnOptions: Option[]
  columnVisibility: VisibilityState
  onColumnSelectionChange: (selected: Option[]) => void
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  activeFilter,
  onFilterChange,
  columnOptions,
  columnVisibility,
  onColumnSelectionChange,
}) => {
  const selectedColumnOptions = useMemo(() => {
    return columnOptions.filter(
      (option) => !columnVisibility[option.value] === false // column is visible if not explicitly set to false
    )
  }, [columnOptions, columnVisibility])

  return (
    <div className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
          <FilterIcon className="h-4 w-4 mr-2" />
          <span>{filterOptions.find((option) => option.value === activeFilter)?.label || 'Filter'}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onFilterChange(option.value as FilterType)}
              className={activeFilter === option.value ? 'bg-accent text-accent-foreground' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <MultiSelect
        placeholder="Select columns"
        options={columnOptions}
        value={selectedColumnOptions}
        onChange={onColumnSelectionChange}
      />
    </div>
  )
}
