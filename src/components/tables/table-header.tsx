'use client';

import type { TableHeaderProps } from '@/@types/table';
import { cn } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';
import { TableHead, TableHeader, TableRow } from '../ui/table';

const CustomTableHeader = <T,>({ table, className }: TableHeaderProps<T>) => {
  return (
    <TableHeader
      className={cn(
        'sticky top-0 z-10 rounded-t-lg border-b border-border/40',
        'bg-gradient-to-r from-slate-50 to-slate-100/80',
        'dark:from-slate-900/95 dark:to-slate-800/95',
        'backdrop-blur-sm',
        'shadow-sm',
        className
      )}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className={cn('hover:bg-transparent dark:hover:bg-transparent', 'border-b border-border/20')}
        >
          {headerGroup.headers.map((header) => {
            const isFirstColumn = header.index === 0;
            const isLastColumn = header.index === headerGroup.headers.length - 1;

            return (
              <TableHead
                key={header.id}
                className={cn(
                  'relative px-4 py-3 text-left',
                  'text-sm font-semibold tracking-wide',
                  'text-slate-700 dark:text-slate-200',
                  'transition-colors duration-200',
                  'hover:bg-slate-200/50 dark:hover:bg-slate-700/30',
                  isFirstColumn && 'rounded-tl-lg',
                  isLastColumn && 'rounded-tr-lg',
                  'sm:px-6',
                  'focus-within:bg-slate-200/50 dark:focus-within:bg-slate-700/30',
                  'min-w-0',
                  className
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {header.isPlaceholder ? null : (
                      <span className="truncate">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                    )}
                  </div>
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default CustomTableHeader;
