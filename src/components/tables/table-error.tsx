import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ onRetry, length }: { onRetry?: () => void; length: number }) => (
  <TableRow>
    <TableCell colSpan={length} className="h-64">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
          <p className="max-w-sm text-gray-500">
            We couldn't fetch the data. Please check your connection and try again.
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-4">
            Try Again
          </Button>
        )}
      </div>
    </TableCell>
  </TableRow>
);
