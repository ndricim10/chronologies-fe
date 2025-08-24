import { TableCell, TableRow } from '@/components/ui/table';
import { Database } from 'lucide-react';

export const EmptyState = ({ noRowsChildren, length }: { noRowsChildren?: React.ReactNode; length: number }) => (
  <TableRow>
    <TableCell colSpan={length} className="h-64">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
          <Database className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No data found</h3>
          <p className="max-w-sm text-gray-500">{noRowsChildren || 'There are no records to display at the moment.'}</p>
        </div>
      </div>
    </TableCell>
  </TableRow>
);
