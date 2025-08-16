import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
}

export interface PaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  data: T[];
}

export interface CommonApiResponse {
  success: boolean;
  message: string;
}

export interface PaginationProps {
  size: number;
  page: number;
}

export type SetPagination = React.Dispatch<React.SetStateAction<PaginationProps>>;

export interface PaginationComponentProps {
  pagination: PaginationProps;
  setPagination: SetPagination;
}

export interface OpenModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

export interface UpdateApiProps<T> {
  id: number;
  body: T;
}

export interface ErrorProps {
  status: number;
  data: {
    message: string;
  };
}

export interface ModalProps<T> extends OpenModalProps {
  defaultValues?: T;
  setDefaultValues: (value: T | undefined) => void;
  disabled?: boolean;
  form?: UseFormReturn<any, any, any>;
}

export interface FieldValueProps {
  label: ReactNode;
  value: string | boolean;
}

export interface OptionsType {
  value: FieldValueProps;
  label?: ReactNode;
  secondLabel?: ReactNode;
  id?: string;
  disabled?: boolean;
}

export interface CommonColumns<T> {
  handleEdit?: (value: T) => void;
  handleDelete?: (value: T) => void;
}

export interface FilterParams extends PaginationProps {
  loading: boolean;
  hasMore: boolean;
  search?: string;
}

export type SetQueryParamsType = React.Dispatch<React.SetStateAction<FilterParams>>;

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export interface CommonUrlParams extends Partial<PaginationProps> {}

export interface FromToProps {
  from?: string;
  to?: string;
}
