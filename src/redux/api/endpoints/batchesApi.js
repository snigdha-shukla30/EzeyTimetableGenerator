import { apiSlice } from "../apiSlice";

export const batchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBatches: builder.query({
      query: () => "/batches",
      providesTags: ["Batches"],
    }),
    addBatch: builder.mutation({
      query: (data) => ({
        url: "/batches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Batches"],
    }),
    updateBatch: builder.mutation({
      query: ({ id, data }) => ({
        url: `/batches/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Batches"],
    }),
    deleteBatch: builder.mutation({
      query: (id) => ({
        url: `/batches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Batches"],
    }),
  }),
});

export const {
  useGetBatchesQuery,
  useAddBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} = batchesApi;
