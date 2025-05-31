import { useState, useMemo } from "react";
import { ResellableItem } from "@/store/state";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { format } from "date-fns";
import { TablePagination } from "./pagination";

const columns: ColumnDef<ResellableItem>[] = [
  {
    id: "itemDetails.name",
    header: "Item Name",
    accessorFn: (row) => row.itemDetails.name,
  },
  {
    id: "listingDetails.title",
    header: "Listing Title",
    accessorFn: (row) => row.listingDetails.title,
  },
  {
    id: "price.buy",
    header: "Buy Price",
    accessorFn: (row) => row.price.buy,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price.buy"));
      return <div className="text-right font-medium">${amount.toFixed(2)}</div>;
    },
  },
  {
    id: "price.sell",
    header: "Sell Price",
    accessorFn: (row) => row.price.sell,
    cell: ({ row }) => {
      const value = row.getValue("price.sell");
      if (value === null) return <div className="text-right">-</div>;
      const amount = parseFloat(value as string);
      return <div className="text-right font-medium">${amount.toFixed(2)}</div>;
    },
  },
  {
    id: "price.credit",
    header: "Credit",
    accessorFn: (row) => row.price.credit,
    cell: ({ row }) => {
      const value = row.getValue("price.credit");
      if (value === null) return <div className="text-right">-</div>;
      const amount = parseFloat(value as string);
      return <div className="text-right font-medium">${amount.toFixed(2)}</div>;
    },
  },
  {
    id: "listingDetails.datePosted",
    header: "Date Posted",
    accessorFn: (row) => row.listingDetails.datePosted,
    cell: ({ row }) => {
      const date = row.getValue("listingDetails.datePosted") as string;
      return format(new Date(date), "MMM d, yyyy");
    },
  },
  {
    id: "listingDetails.condition",
    header: "Condition",
    accessorFn: (row) => row.listingDetails.condition,
  },
];

const columnOptions: Option[] = columns.map(column => ({
    label: String(column.header),
    value: String(column.id)
  }))

const defaultColumnVisibility: VisibilityState = {
  "itemDetails.name": true,
  "listingDetails.title": true,
  "price.buy": true,
  "price.credit": true,
  "price.sell": false,
  "listingDetails.datePosted": false,
  "listingDetails.condition": false,
}

interface DealsTableProps {
  items: ResellableItem[]
}

const DealsTable = ({items}: DealsTableProps) => {
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility);


  // Get currently selected column options
  const selectedColumnOptions = useMemo(() => {
    return columnOptions.filter(option => 
      !columnVisibility[option.value] === false // column is visible if not explicitly set to false
    );
  }, [columnOptions, columnVisibility]);

  // Handle column selection changes
  const handleColumnSelectionChange = (selected: Option[]) => {
    const newVisibility: VisibilityState = {};
    
    // Set all columns to hidden by default
    columnOptions.forEach(option => {
      newVisibility[option.value] = false;
    });
    
    // Set selected columns to visible
    selected.forEach(option => {
      newVisibility[option.value] = true;
    });
    
    setColumnVisibility(newVisibility);
  };

  // Setup table with TanStack
  const table = useReactTable({
    data: items,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
                  <TableHead key={header.id} className="bg-primary-foreground text-md">
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
  );
}

export default DealsTable;

