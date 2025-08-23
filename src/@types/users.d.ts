import { Key } from 'react';
import { CommonUrlParams, FromToProps, OptionsType, PaginationProps, SetPagination } from './common';
import { ROLES, UserStatus } from './enums';

export interface LoginData {
  username: string;
  password: string;
}

export interface UserData extends CreateUser {
  id: number;
}

export interface UserFiltersProps {
  setPaginationValues: SetPagination;
  setName: (value: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<CommonUrlParams | undefined>>;
  filters?: CommonUrlParams;
}

export type UserTypeName = keyof CreateUser;

export interface UserBase {
  name: string;
  surname: string;
  fullName: string;
  email: string;
  role: ROLES;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: ROLES;
}

export interface UserResponse extends UserBase {
  username: string;
  id: number;
  userId?: number;
  createdAt: Date;
  status: UserStatus;
}

export interface CreateUser extends UserBase {
  password: string;
  username: string;
}

export interface UserData {
  user: UserResponse;
}

export interface UserFilterProps extends FromToProps {
  label?: string;
  name?: string;
  fullName?: string;
  role?: string | string[];
  status?: UserStatus | string;
  sort?: string;
  sortOrder?: string;
  sortBy?: string;
  branchId?: Key;
}

export interface UserParams extends UserFilterProps, PaginationProps {}

export interface UserItemProps {
  roleOptions: OptionsType[];
  defaultValues?: UserResponse;
  role?: ROLES;
  disabled?: boolean;
}

export interface UpdateProfileRequest {
  name: string;
  surname: string;
  email: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
