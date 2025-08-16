import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableSkeletonProps {
  columns: number;
}

export const TableSkeleton = ({ columns }: TableSkeletonProps) => (
  <>
    {Array.from({ length: 5 }).map((_, rowIndex) => (
      <TableRow key={rowIndex} className="border-b border-gray-100">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex} className="py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);
