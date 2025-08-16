import { Chronology, DownloadFile } from '@/@types/chronology';
import { PaginationProps, PaginationReturn } from '@/@types/common';
import { UserResponse } from '@/@types/users';
import { filteredNullData, getBaseApiUrl, getPrepareHeaders } from '@/utils/common-functions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type UserType = PaginationReturn<UserResponse>;

export const chronologyApi = createApi({
  reducerPath: 'chronology',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseApiUrl(),
    prepareHeaders: getPrepareHeaders,
  }),
  tagTypes: ['ChronologyFiles'],
  endpoints: (builder) => ({
    getChronologyFiles: builder.query<PaginationReturn<Chronology>, PaginationProps>({
      query: (params) => ({
        url: 'chronologies',
        params: filteredNullData(params),
      }),
      providesTags: ['ChronologyFiles'],
    }),

    uploadChronology: builder.mutation<
      {
        message: string;
        file: { id: number; originalName: string; createdAt: string };
      },
      File
    >({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/chronologies',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ChronologyFiles'],
    }),
    exportExelFile: builder.query<Blob, DownloadFile>({
      query: ({ fileId, ...params }) => ({
        url: `/chronologies/${fileId}/download`,
        params: filteredNullData(params),
        responseHandler: async (response) => await response.blob(),
      }),
    }),
  }),
});

export const { useGetChronologyFilesQuery, useUploadChronologyMutation, useLazyExportExelFileQuery } = chronologyApi;
