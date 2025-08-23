import { ColumnDef, Table } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { PaginationComponentProps } from './common';

export interface LoadingProps {
  isFetching?: boolean;
  isError?: boolean;
}

export interface GenericTableProps<T> extends Partial<PaginationComponentProps>, LoadingProps {
  data?: T[];
  totalPages?: number;
  columns?: ColumnDef<any>[];
  showColumns?: boolean;
  footer?: ReactNode;
  children?: ChildrenType;
  pageSize?: number;
  noRowsChildren?: ReactNode;
  className?: string;
  isMobile?: boolean;
  tableClassName?: string;
  showItemsPerPage?: boolean;
  showJumpToEnds?: boolean;
}

export type CollapseType = {
  [key: string]: boolean;
};

export type ChildrenType = {
  [key: string]: ReactNode;
};

export interface TableHeaderProps<T> {
  table: Table<T>;
  className?: string;
}

export interface NoRowsProps extends LoadingProps {
  length: number;
  children?: ReactNode;
  className?: string;
}

export interface GenericWrapperProps<T> extends GenericTableProps<T>, LoadingProps {
  data?: T[];
  title?: string;
}
