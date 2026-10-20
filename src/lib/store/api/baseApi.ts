import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiError } from './apiUtils'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: ['Projects', 'Tasks', 'Members', 'Users'],
  endpoints: () => ({}),
})