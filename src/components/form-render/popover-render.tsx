import type { FieldProps } from '@/@types/form-render';
import { debouncedSetName, isCursorPointer } from '@/utils/common-functions';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDown, X } from 'lucide-react';
import type React from 'react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import Spinner from '../common-cards/Spinner';
import './styles.css';

const PopoverRender = ({
  dropdownData = { isLoading: false, lastEntryRef: () => {}, options: [] },
  onChange,
  value,
  placeholder,
  lastOptionRef,
  isSearchable = true,
  setSearchValue,
  placeholderSearch,
  noValueFound,
  disabled,
  displayIcon = true,
  removeValue,
  name = '',
  setFilters,
  commandListClassname,
  selectedLabel,
  className,
  ...field
}: FieldProps) => {
  const { isLoading = false, options = [], onSelectChange, lastEntryRef } = dropdownData;

  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [select, setSelect] = useState<string>();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelect(selectedLabel ?? undefined);
  }, [selectedLabel]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (searchMode && open && isSearchable) {
      [0, 10, 50, 100].forEach((delay) => setTimeout(() => inputRef.current?.focus(), delay));
      setSearchText('');
      setSearchValue?.('');
    }
  }, [searchMode, open, isSearchable]);

  const displayLabel = options.find((item) => item.value.value === value)?.label || select;

  const onValueChange = (val: string) => {
    onChange?.(val);
    onSelectChange?.(val);
    setOpen(false);
    setSearchText('');
    setSearchValue?.('');
    setSearchMode(false);
    setFilters?.((prev: any) => ({ ...prev, [name]: val }));
    if (!setSearchValue) setFilteredOptions(options);
  };

  const onRemoveValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    removeValue?.();
    setSelect(undefined);
    setSearchText('');
    setSearchMode(false);
    setFilters?.((prev: any) => ({ ...prev, [name]: '' }));
    if (!setSearchValue) setFilteredOptions(options);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    if (setSearchValue) {
      debouncedSetName(val, setSearchValue);
    } else {
      const filtered = options.filter((item) => {
        const labelText = typeof item.label === 'string' ? item.label : '';
        const secondLabelText = typeof item.secondLabel === 'string' ? item.secondLabel : '';
        return (
          labelText.toLowerCase().includes(val.toLowerCase()) ||
          secondLabelText.toLowerCase().includes(val.toLowerCase())
        );
      });
      setFilteredOptions(filtered);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (!searchMode) {
        setSearchMode(true);
        setSearchText(' ');
        setTimeout(() => inputRef.current?.focus(), 0);
      } else {
        setSearchText((prev) => prev + ' ');
      }
    }
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'Enter' && filteredOptions.length === 1) {
      onValueChange(filteredOptions[0].value.value as string);
    } else if (e.key === 'ArrowDown' && commandListRef.current) {
      e.preventDefault();
      const firstItem = commandListRef.current.querySelector('[role="option"]') as HTMLElement;
      firstItem?.focus();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.closest('[data-radix-popper-content-wrapper]')) setOpen(false);
    }, 100);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      if (!open) {
        setOpen(true);
        setSearchMode(true);
      } else {
        setSearchMode(!searchMode);
      }
    }
  };

  return (
    <Popover
      {...field}
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchMode(false);
          setSearchText('');
          if (!setSearchValue) setFilteredOptions(options);
        } else if (!setSearchValue) setFilteredOptions(options);
      }}
    >
      <PopoverTrigger
        asChild
        className={cn(
          `h-9 dark:text-slate-100 ${isCursorPointer(disabled)}`,
          !value && 'text-muted-foreground',
          className
        )}
        disabled={disabled}
      >
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          onClick={handleButtonClick}
          className={cn(
            `relative flex h-9 w-full justify-between bg-white hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700`,
            (!value || value === '') && 'font-normal text-gray-500 dark:text-slate-400',
            searchMode && 'p-0 pl-2 pr-8',
            isCursorPointer(disabled)
          )}
          disabled={disabled}
          type="button"
        >
          {searchMode && isSearchable ? (
            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholderSearch ?? 'Search...'}
              className="h-full w-full flex-1 bg-transparent p-0 pl-2 text-sm outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
              onClick={(e) => e.stopPropagation()}
              onBlur={handleBlur}
            />
          ) : (
            <span className={cn(!value && 'text-muted-foreground')}>{displayLabel || placeholder}</span>
          )}

          {displayIcon && Boolean(value) ? (
            <Button onClick={onRemoveValue} className="!bg-transparent p-0">
              <X size={18} className="text-slate-900 dark:text-slate-50" />
            </Button>
          ) : (
            <ChevronDown className="absolute right-2 h-4 w-4 shrink-0 text-gray-500 dark:text-slate-400" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full min-w-80 border p-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
        style={{ width: triggerRef.current?.offsetWidth ?? 'auto' }}
        onWheel={(e) => {
          const target = e.target as HTMLElement;
          const scrollableParent = target.closest('[data-scroll-area]') || commandListRef.current;
          if (scrollableParent?.contains(target)) return;
        }}
      >
        <Command className="flex flex-col" shouldFilter={false}>
          <CommandList
            ref={commandListRef}
            data-scroll-area="true"
            className={cn('custom-dropdown-scroll max-h-60 overflow-y-auto overscroll-contain', commandListClassname)}
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            {isLoading ? (
              <Spinner className="!max-h-20 min-h-40 w-full items-center justify-center" />
            ) : (setSearchValue ? options : filteredOptions).length === 0 ? (
              <CommandEmpty>{noValueFound ?? 'No results found'}</CommandEmpty>
            ) : (
              <CommandGroup>
                {(setSearchValue ? options : filteredOptions).map((item, index) => {
                  const isLastItem = index === (setSearchValue ? options : filteredOptions).length - 1;
                  const isSelected = value === item.value.value;

                  return (
                    <CommandItem
                      key={index}
                      value={item.value.value as string}
                      onSelect={() => onValueChange(item.value.value as string)}
                      className={cn(
                        'relative flex items-start gap-2 px-2 py-2',
                        'cursor-pointer hover:bg-secondary hover:text-secondary-foreground',
                        isSelected && 'bg-secondary/10 font-medium text-secondary-foreground'
                      )}
                      ref={isLastItem ? lastEntryRef : null}
                    >
                      <CheckIcon
                        className={cn('mt-0.5 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="text-sm leading-tight">{item.label}</div>
                        {item.secondLabel && (
                          <div className="text-xs leading-tight text-muted-foreground">{item.secondLabel}</div>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverRender;
