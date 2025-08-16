import { LoginData } from '@/@types/auth';
import { getBaseApiUrl, getPrepareHeaders } from '@/utils/common-functions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseApiUrl(),
    prepareHeaders: getPrepareHeaders,
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<{ jwt: string }, LoginData>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation } = authApi;
