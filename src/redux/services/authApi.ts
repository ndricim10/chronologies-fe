import {
  CreateUser,
  LoginData,
  LoginResponse,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserData,
  UserParams,
  UserResponse,
} from '@/@types/users';
import { CommonApiResponse, PaginationReturn, UpdateApiProps } from '@/@types/common';
import { getCommonUrl } from '@/utils/get-common-url';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseApiUrl, getPrepareHeaders } from '@/utils/common-functions';

export type UserType = PaginationReturn<UserResponse>;

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseApiUrl(),
    prepareHeaders: getPrepareHeaders,
  }),
  tagTypes: ['User', 'LoggedInUser', 'UserById'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginData>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'LoggedInUser'],
    }),
    getUsers: builder.query<UserType, UserParams>({
      query: (args: any) => ({
        url: getCommonUrl(args, 'users'),
      }),
      providesTags: ['User'],
    }),
    getLoggedInUser: builder.query<UserResponse, void>({
      query: () => ({
        url: '/users/get-loggedin-user',
      }),
      providesTags: ['LoggedInUser'],
    }),

    getUserById: builder.query<UserData, number>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: ['UserById'],
    }),

    createUser: builder.mutation<CommonApiResponse, CreateUser>({
      query: (body) => ({
        url: '/users/create-user',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    editUser: builder.mutation<CommonApiResponse, UpdateApiProps<CreateUser>>({
      query: ({ body, id }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<CommonApiResponse, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation<CommonApiResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: '/users/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['LoggedInUser'],
    }),

    updatePassword: builder.mutation<CommonApiResponse, UpdatePasswordRequest>({
      query: (body) => ({
        url: '/users/profile/password',
        method: 'PATCH',
        body,
      }),
    }),
    resetPassword: builder.mutation<CommonApiResponse, { id: number; newPassword: string }>({
      query: ({ id, newPassword }) => ({
        url: `/users/${id}/reset-password`,
        method: 'POST',
        body: { newPassword },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetLoggedInUserQuery,
  useLoginMutation,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useResetPasswordMutation,
} = authApi;
