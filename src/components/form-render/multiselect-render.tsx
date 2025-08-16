import { OptionsType } from '@/@types/common';
import { FieldProps } from '@/@types/form-render';
import { debouncedSetName, isCursorPointer } from '@/utils/common-functions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDown, X } from 'lucide-react';
import type React from 'react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import Spinner from '../common-cards/Spinner';
import './styles.css';

const MultiSelectRender = ({
  dropdownData = {
    isLoading: false,
    lastEntryRef: () => {},
    options: [],
  },
  onChange,
  value,
  placeholder,
  lastOptionRef,
  isSearchable = true,
  setSearchValue,
  placeholderSearch,
  noValueFound = 'No results found',
  disabled,
  displayIcon = true,
  removeValue,
  name = '',
  setFilters,
  commandListClassname,
  multiselectValue = [],
  setValue,
  type = 'select',
  className,
  ...field
}: FieldProps) => {
  const { isLoading = false, options = [], onSelectChange, lastEntryRef } = dropdownData;
  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options.length]);

  useEffect(() => {
    if (searchMode && open && isSearchable) {
      const focusAttempts = [0, 10, 50, 100];
      focusAttempts.forEach((delay) => {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, delay);
      });
      setSearchText('');
      setSearchValue?.('');
    }
  }, [searchMode, open, isSearchable]);

  const selectedLabels = multiselectValue.map((v) => v.label);

  const onValueChange = (selectedOption: OptionsType) => {
    const isCurrentlySelected = multiselectValue.some((v) => v.value === selectedOption.value.value);
    const newValues = isCurrentlySelected
      ? multiselectValue.filter((v) => v.value !== selectedOption.value.value)
      : [...multiselectValue, selectedOption.value];

    setValue?.(newValues);
    onChange?.(newValues);
    onSelectChange?.(selectedOption.value.value as string);
    setFilters?.((prev: any) => ({ ...prev, [name]: newValues }));

    setSearchText('');
    setSearchValue?.('');

    if (!setSearchValue) {
      setFilteredOptions(options);
    }
  };

  const onRemoveValue = (valueToRemove: string | boolean, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const newValues = multiselectValue.filter((v) => v.value !== valueToRemove);
    setValue?.(newValues);
    onChange?.(newValues);
    removeValue?.();
    setFilters?.((prev: any) => ({ ...prev, [name]: newValues }));
  };

  const onRemoveAllValues = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue?.([]);
    onChange?.([]);
    removeValue?.();
    setFilters?.((prev: any) => ({ ...prev, [name]: [] }));
    setSearchText('');
    setSearchMode(false);

    if (!setSearchValue) {
      setFilteredOptions(options);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (setSearchValue) {
      debouncedSetName(value, setSearchValue);
    } else {
      const filtered = options.filter((item) => {
        const labelText = typeof item.label === 'string' ? item.label : '';
        const secondLabelText = typeof item.secondLabel === 'string' ? item.secondLabel : '';
        const searchLower = value.toLowerCase();

        return labelText.toLowerCase().includes(searchLower) || secondLabelText.toLowerCase().includes(searchLower);
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
    if (e.key === 'Escape') {
      setSearchMode(false);
      setOpen(false);
    } else if (e.key === 'ArrowDown' && commandListRef.current) {
      e.preventDefault();
      const firstItem = commandListRef.current.querySelector('[role="option"]') as HTMLElement;
      if (firstItem) firstItem.focus();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.closest('[data-radix-popper-content-wrapper]')) {
        setOpen(false);
      }
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
          if (!setSearchValue) {
            setFilteredOptions(options);
          }
        } else {
          if (!setSearchValue) {
            setFilteredOptions(options);
          }
        }
      }}
    >
      <PopoverTrigger
        asChild
        className={cn(
          `h-auto dark:text-card ${isCursorPointer(disabled)}`,
          multiselectValue.length === 0 && 'text-muted-foreground',
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
            `relative flex h-auto min-h-[36px] w-full flex-wrap justify-between bg-white p-1 hover:bg-white focus:bg-white dark:bg-white dark:text-card ${isCursorPointer(disabled)}`,
            multiselectValue.length === 0 && 'font-normal text-gray-500 hover:text-gray-500',
            searchMode && 'p-0 pl-2 pr-8'
          )}
          disabled={disabled}
          type="button"
        >
          {searchMode && isSearchable ? (
            <div className="h-full flex-1">
              <input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholderSearch ?? 'Search...'}
                className="no-borders h-full w-full border-none bg-transparent p-0 pl-2 outline-none md:pl-8"
                onClick={(e) => e.stopPropagation()}
                onBlur={handleBlur}
              />
            </div>
          ) : multiselectValue.length === 0 ? (
            <span className={cn('text-muted-foreground')}>{placeholder}</span>
          ) : (
            <div className="flex max-w-[80%] gap-1 truncate">
              {selectedLabels.map((label, index) => (
                <Badge key={index} variant="secondary" className="mb-1 mr-1">
                  {label}
                  <button
                    className="ml-1 rounded-full bg-transparent p-0 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onRemoveValue(multiselectValue[index].value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveValue(multiselectValue[index].value, e);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {displayIcon && multiselectValue.length > 0 ? (
            <Button onClick={onRemoveAllValues} className="!bg-transparent p-0">
              <X size={18} className="text-black" />
            </Button>
          ) : (
            <ChevronDown className={cn('absolute right-2 h-4 w-4 shrink-0 !opacity-100')} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-80 border p-0"
        style={{ width: triggerRef.current ? `${triggerRef.current.offsetWidth}px` : 'auto' }}
        onWheel={(e) => {
          const target = e.target as HTMLElement;
          const scrollableParent = target.closest('[data-scroll-area]') || commandListRef.current;

          if (scrollableParent && scrollableParent.contains(target)) {
            return;
          }
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
              <CommandEmpty>{noValueFound}</CommandEmpty>
            ) : (
              <CommandGroup>
                {(setSearchValue ? options : filteredOptions).map((item, index) => {
                  const isLastItem = index === (setSearchValue ? options : filteredOptions).length - 1;
                  const isSelected = multiselectValue.some((v) => v.value === item.value.value);

                  return (
                    <CommandItem
                      key={index}
                      value={item.value.value.toString()}
                      onSelect={() => onValueChange(item)}
                      className={cn(
                        'relative flex items-start gap-2 px-2 py-2',
                        'cursor-pointer hover:bg-secondary hover:text-secondary-foreground',
                        isSelected && 'bg-secondary/10 font-medium text-secondary-foreground',
                        item.disabled && 'cursor-not-allowed opacity-50'
                      )}
                      ref={isLastItem ? lastEntryRef : null}
                      disabled={item.disabled}
                    >
                      <CheckIcon
                        className={cn('mt-0.5 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="text-sm leading-tight">{item.label || item.value.label}</div>
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

export default MultiSelectRender;
