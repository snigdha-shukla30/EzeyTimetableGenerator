import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ["Subjects", "Batches", "Classrooms", "Faculty"],

  baseQuery: fetchBaseQuery({
    
    baseUrl: import.meta.env.VITE_BASE_URL, 
    credentials: 'include',
  }),

  endpoints: () => ({}),
})






