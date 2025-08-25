import { useToast, ToastVariant } from '@/hooks/use-toast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

// Variant styles mapping
const variantStyles: Record<ToastVariant, string> = {
  default: 'border-border bg-background text-foreground',
  success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
  warning:
    'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
  destructive: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
};

// Icon mapping
const variantIcons: Record<ToastVariant, React.ComponentType<{ className?: string }> | null> = {
  default: null,
  success: CheckCircle,
  warning: AlertCircle,
  destructive: XCircle,
  info: Info,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = 'default', ...props }) {
        const Icon = variantIcons[variant];

        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              variantStyles[variant],
              'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full'
            )}
          >
            <div className="flex flex-1 items-start gap-3">
              {Icon && <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />}
              <div className="grid flex-1 gap-1">
                {title && <ToastTitle className="text-sm font-semibold">{title}</ToastTitle>}
                {description && <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
