import { apiSlice } from "../apiSlice";

export const facultyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query({
      query: () => "/faculties",
      providesTags: ["Faculty"],
    }),
    addFaculty: builder.mutation({
      query: (data) => ({
        url: "/faculties",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faculties/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),
    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `/faculties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),
    bulkUploadFaculties: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/faculties/bulk-upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Faculty"],
    }),
  }),
});

export const {
  useGetFacultiesQuery,
  useAddFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useBulkUploadFacultiesMutation,
} = facultyApi;
