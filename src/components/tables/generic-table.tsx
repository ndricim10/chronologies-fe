import { GenericTableProps } from '@/@types/table';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { initialPage } from '@/utils/common-functions';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PaginationComponent } from './Pagination';
import ColumnsDropdown from './columns-dropdown';
import { EmptyState } from './empty-state';
import CustomTableHeader from './table-header';
import { TableSkeleton } from './table-skeleton';
import { ErrorState } from './table-error';

export function GenericTable<T>({
  data = [],
  columns = [],
  pagination = initialPage,
  setPagination,
  showColumns,
  footer,
  pageSize,
  noRowsChildren,
  className,
  isError,
  isFetching,
  tableClassName,
  onRetry,
  ...field
}: GenericTableProps<T> & { onRetry?: () => void }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: pageSize
      ? {
          pagination: {
            pageSize,
            pageIndex: pagination.page,
          },
        }
      : undefined,
  });

  return (
    <div className={cn('w-full space-y-4', className)}>
      {showColumns && (
        <div className="flex justify-end">
          <ColumnsDropdown table={table} />
        </div>
      )}

      <Card className="border-0 shadow-xl">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600/30">
            <Table className={cn('w-full', tableClassName)}>
              <CustomTableHeader table={table} />
              <TableBody className="bg-white dark:bg-gray-800/30">
                {isFetching ? (
                  <TableSkeleton columns={columns.length} />
                ) : isError ? (
                  <ErrorState onRetry={onRetry} length={columns.length} />
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={cn(
                        'border-b transition-colors',
                        'border-gray-200 hover:bg-gray-50/50',
                        'dark:border-gray-600/30 dark:hover:bg-gray-700/30',
                        index % 2 === 0 ? 'bg-white dark:bg-gray-800/20' : 'bg-gray-50/20 dark:bg-gray-700/20'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <EmptyState noRowsChildren={noRowsChildren} length={columns.length} />
                )}

                {footer && (
                  <TableRow className="border-t-2 border-gray-200 bg-gray-50 dark:border-gray-600/50 dark:bg-gray-700/40">
                    <TableCell
                      colSpan={columns.length}
                      className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100"
                    >
                      {footer}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {setPagination && (
        <div className="flex justify-center">
          <PaginationComponent
            {...{ pagination, setPagination }}
            {...field}
            className="rounded-lg border border-gray-200 bg-white/80 p-4 text-gray-900 shadow-sm backdrop-blur-sm dark:border-gray-600/30 dark:bg-gray-800/50 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
