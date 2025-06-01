import {useState, useMemo} from 'react'
import {ResellableItem} from '@/store/state'
import {ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState} from '@tanstack/react-table'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {MultiSelect, Option} from '@/components/ui/multi-select'
import {format} from 'date-fns'
import {TablePagination} from './pagination'
import {PriceCell, PriceHeader, ActionCell} from './cells'

type ExtendedColumnDef<T> = ColumnDef<T> & {
  displayName?: string
}

const columns: ExtendedColumnDef<ResellableItem>[] = [
  {
    id: 'itemDetails.name',
    header: 'Item Name',
    displayName: 'Item Name',
    accessorFn: (row) => row.itemDetails.name,
  },
  {
    id: 'listingDetails.title',
    header: 'Listing Title',
    displayName: 'Listing Title',
    accessorFn: (row) => row.listingDetails.title,
  },
  {
    id: 'price.buy',
    header: () => <PriceHeader>Buy Price</PriceHeader>,
    displayName: 'Buy Price',
    accessorFn: (row) => row.price.buy,
    cell: ({row}) => <PriceCell rawAmount={row.getValue('price.buy')} />,
  },
  {
    id: 'price.sell',
    header: () => <PriceHeader>Sell Price</PriceHeader>,
    displayName: 'Sell Price',
    accessorFn: (row) => row.price.sell,
    cell: ({row}) => <PriceCell rawAmount={row.getValue('price.sell')} />,
  },
  {
    id: 'price.credit',
    header: () => <PriceHeader>Credit</PriceHeader>,
    displayName: 'Credit',
    accessorFn: (row) => row.price.credit,
    cell: ({row}) => <PriceCell rawAmount={row.getValue('price.credit')} />,
  },
  {
    id: 'listingDetails.datePosted',
    header: 'Date Posted',
    displayName: 'Date Posted',
    accessorFn: (row) => row.listingDetails.datePosted,
    cell: ({row}) => {
      const date = row.getValue('listingDetails.datePosted') as string
      return format(new Date(date), 'MMM d, yyyy')
    },
  },
  {
    id: 'listingDetails.condition',
    header: 'Condition',
    displayName: 'Condition',
    accessorFn: (row) => row.listingDetails.condition,
  },
  {
    id: 'actions',
    header: () => <div className="max-w-10"></div>,
    displayName: 'Actions',
    cell: ({row}) => <ActionCell url={row.original.listingDetails.url} />,
    enableSorting: false,
  },
]

const columnOptions: Option[] = columns.map((column) => ({
  label: column.displayName || String(column.id),
  value: String(column.id),
}))

const defaultColumnVisibility: VisibilityState = {
  'itemDetails.name': true,
  'listingDetails.title': true,
  'price.buy': true,
  'price.credit': true,
  'price.sell': false,
  'listingDetails.datePosted': false,
  'listingDetails.condition': false,
  'actions': false
}

interface DealsTableProps {
  items: ResellableItem[]
}

const DealsTable = ({items}: DealsTableProps) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility)

  const selectedColumnOptions = useMemo(() => {
    return columnOptions.filter(
      (option) => !columnVisibility[option.value] === false // column is visible if not explicitly set to false
    )
  }, [columnOptions, columnVisibility])

  const handleColumnSelectionChange = (selected: Option[]) => {
    const newVisibility: VisibilityState = {}

    columnOptions.forEach((option) => {
      newVisibility[option.value] = false
    })

    selected.forEach((option) => {
      newVisibility[option.value] = true
    })

    setColumnVisibility(newVisibility)
  }

  const table = useReactTable({
    data: items,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Deals Table</h1>
        <div className="flex items-center space-x-2">
          <MultiSelect
            placeholder="Select columns"
            options={columnOptions}
            value={selectedColumnOptions}
            onChange={handleColumnSelectionChange}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-primary-foreground text-md"
                  >
                    {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-xs"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No deals.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        totalItems={items.length}
        onNextPagePress={() => table.nextPage()}
        onPreviousPagePress={() => table.previousPage()}
        disableNextPage={!table.getCanNextPage()}
        disablePreviousPage={!table.getCanPreviousPage()}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  )
}

export default DealsTable
