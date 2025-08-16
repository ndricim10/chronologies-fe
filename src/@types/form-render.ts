import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { FieldValueProps, OptionsType } from './common';

export type FieldType =
  | 'datePicker'
  | 'inputText'
  | 'inputPassword'
  | 'inputNumber'
  | 'inputEmail'
  | 'checkbox'
  | 'textArea'
  | 'select'
  | 'multiselect'
  | 'checkboxgroup'
  | 'table'
  | 'customComponent'
  | 'button';

interface FunctionFieldProps {
  lastOptionRef?: (node: Element | null) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  setSearchValue?: (value: string) => void;
  onInputChange?: (value: string) => void;
  handleClick?: () => void;
  onCancel?: () => void;
  onCheckedChange?: (value: boolean) => void;
}

export interface DropdownData {
  isLoading?: boolean;
  lastEntryRef?: (node: Element | null) => void;
  options?: OptionsType[];
  onSelectChange?: (value: string) => void;
}

export interface FormFieldItems<T> extends FunctionFieldProps {
  name?: T;
  dropdownData?: DropdownData;
  type?: FieldType;
  checkboxOptions?: OptionsType[];
  selected?: OptionsType[];
  setSelected?: React.Dispatch<React.SetStateAction<OptionsType[]>>;
  label?: string;
  placeholder?: string;
  datePickerText?: string;
  checkBoxLabel?: string;
  checkBoxId?: string;
  gridcolumnclass?: string;
  className?: string;
  isSearchable?: boolean;
  placeholderSearch?: string;
  noValueFound?: string;
  selectValue?: string;
  isDefaultValue?: boolean;
  displayIcon?: boolean;
  showItem?: boolean;
  showlabel?: boolean;
  disabled?: boolean;
  defaultChecked?: boolean;
  customProps?: Record<string, any>;
  isCurrentDate?: boolean;
  removeValue?: () => void;
  disableDate?: boolean;
  onOpenChange?: (value: boolean) => void;
  commandListClassname?: string;
  selectedLabel?: string;
  setFilters?: any;
  multiselectValue?: FieldValueProps[];
  setValue?: (value: FieldValueProps[]) => void;
}

export interface FieldProps<T extends string = string>
  extends FormFieldItems<T>,
    Partial<ControllerRenderProps<any, T>> {}

export interface CustomFieldComponents extends Record<string, (props: any) => JSX.Element> {}

export interface FormRenderProps<T> {
  form: UseFormReturn<any, any, any>;
  formFields: FormFieldItems<T>[];
  formFieldWrapperStyles?: string;
  customFieldComponents?: CustomFieldComponents;
}
