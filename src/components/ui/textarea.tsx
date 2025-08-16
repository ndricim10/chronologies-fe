import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      tabIndex={-1}
      className={cn(
        'bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400',
        className
      )}
      style={{ outline: 'none' }}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
