import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onNextPagePress: () => void;
  onPreviousPagePress: () => void;
  disableNextPage: boolean;
  disablePreviousPage: boolean;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  onNextPagePress,
  onPreviousPagePress,
  disableNextPage,
  disablePreviousPage,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50]
}: TablePaginationProps) {

  const itemsFrom = currentPage * pageSize + 1;
  const itemsTo = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-500">
          Showing {itemsFrom} to {itemsTo} of {totalItems}
        </p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPagePress}
          disabled={disablePreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPagePress}
          disabled={disableNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
