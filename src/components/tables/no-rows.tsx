import { NoRowsProps } from '@/@types/table';
import { TableCell, TableRow } from '../ui/table';
import { TableSkeleton } from './table-skeleton';
import { TableError } from './table-error';
import { cn } from '@/lib/utils';

const NoRows = ({ length = 0, children = 'Nuk u gjetën rezultate!', className, isError, isFetching }: NoRowsProps) => {
  return (
    <TableRow>
      <TableCell colSpan={length} className="h-24 text-center">
        <div className={cn('font-medium text-primary', className)}>
          {isFetching ? <TableSkeleton columns={length} rows={1} /> : isError ? <TableError /> : children}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default NoRows;
