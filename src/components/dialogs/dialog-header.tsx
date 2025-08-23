import type { ReactNode } from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CustomModalHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export const CustomModalHeader = ({ icon, title, description, className }: CustomModalHeaderProps) => {
  return (
    <DialogHeader className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 opacity-50 dark:from-gray-700/20 dark:via-gray-700/20 dark:to-gray-700/20" />

      <div className="relative space-y-1 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg dark:from-blue-700 dark:to-purple-800 dark:shadow-gray-900/50">
            {icon}
          </div>

          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="mt-0.5 text-sm leading-snug text-gray-600 dark:text-gray-300">
                {description}
              </DialogDescription>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-600/30" />
    </DialogHeader>
  );
};
