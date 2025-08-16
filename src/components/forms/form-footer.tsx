import { FormFooterProps } from '@/@types/custom-components';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';

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
    <div className={cn('gap-2 sm:flex sm:justify-end', className)}>
      {onCancel && (
        <Button
          type="button"
          onClick={onCancel}
          className="flex w-full items-center gap-2 border bg-secondary text-card hover:bg-secondary dark:bg-secondary dark:text-card dark:hover:bg-secondary sm:w-[200px]"
        >
          <X size={18} className="text-card" />
          <span>{cancel}</span>
        </Button>
      )}
      <Button
      isLoading={isLoading}
        className={cn(
          'flex w-full items-center gap-2 bg-primary hover:bg-primary dark:bg-primary dark:text-card dark:hover:bg-primary sm:w-[200px]',
          submitClassName
        )}
        disabled={disabled}
        onClick={onClick}
      >
          <>
            {isSave ? <Check size={18} className="text-card" /> : <X size={18} className="text-card" />}
            {save}
          </>
      </Button>
    </div>
  );
};

export default FormFooter;
