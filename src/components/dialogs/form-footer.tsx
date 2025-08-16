'use client';

import { cn } from '@/lib/utils';
import { Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormFooterProps {
  cancel?: string;
  disabled?: boolean;
  onCancel?: () => void;
  onClick?: () => void;
  save?: string;
  className?: string;
  isSave?: boolean;
  submitClassName?: string;
  isLoading?: boolean;
}

const FormFooter = ({
  cancel = 'Anullo',
  disabled = false,
  onCancel,
  onClick,
  save = 'Ruaj',
  className,
  isSave = true,
  submitClassName,
  isLoading,
}: FormFooterProps) => {
  return (
    <div className="relative">
      {/* Top border with gradient */}
      <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className={cn('flex flex-col-reverse gap-3 px-6 pb-6 sm:flex-row sm:justify-end sm:gap-4', className)}>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className={cn(
              'h-11 px-6 font-medium transition-all duration-200 sm:min-w-[140px]',
              'border-border bg-background text-muted-foreground',
              'hover:border-muted hover:bg-muted/50 hover:text-foreground',
              'focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'shadow-input hover:shadow-card'
            )}
          >
            <X size={18} className="mr-2" />
            {cancel}
          </Button>
        )}

        <Button
          type="submit"
          disabled={disabled || isLoading}
          onClick={onClick}
          className={cn(
            'h-11 px-6 font-semibold text-white transition-all duration-200 sm:min-w-[140px]',
            'bg-primary shadow-elegant',
            'hover:scale-[1.02] hover:bg-gradient-primary hover:shadow-glow',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
            'focus:ring-2 focus:ring-accent focus:ring-offset-2',
            'active:scale-[0.98]',
            submitClassName
          )}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Duke ruajtur...
            </>
          ) : (
            <>
              {isSave ? <Check size={18} className="mr-2" /> : <X size={18} className="mr-2" />}
              {save}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormFooter;
