import { FieldProps } from '@/@types/form-render';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarDaysIcon, X } from 'lucide-react';
import { useState } from 'react';

const DatePickerRender = ({
  datePickerText,
  value,
  onChange,
  disabled = false,
  disableDate = false,
  className,
  onCancel,
  removeValue,
  selectValue,
  setFilters,
  name,
}: FieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDate = value && value instanceof Date && !isNaN(Number(value)) ? value : selectValue ?? '';

  const onSelect = (value?: Date) => {
    onChange?.(value);
    setIsOpen(false);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();

    onCancel?.();
    removeValue?.();

    if (setFilters && name) {
      setFilters((prev: any) => ({ ...prev, [name]: '' }));
    }

    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          className={cn(
            'flex h-9 w-full justify-between border font-normal',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disableDate}
        >
          <div className="flex items-center">
            <CalendarDaysIcon className="mr-2 h-4 w-4" />
            {isDate ? <span>{format(isDate, 'dd/MM/yyyy')}</span> : <span>{datePickerText}</span>}
          </div>
          {isDate && (
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  const xIcon = e.currentTarget.querySelector('svg');
                  if (xIcon) {
                    handleClick(e as unknown as React.MouseEvent<SVGSVGElement, MouseEvent>);
                  }
                }}
              >
                <X size={18} className="text-primary" />
              </Button>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          disabled={(date) => (disabled ?? date > new Date()) || date < new Date('1900-01-01')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerRender;
