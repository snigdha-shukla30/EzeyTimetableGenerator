import { apiSlice } from "../apiSlice";

export const classroomsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query({
      query: () => "/classrooms",
      providesTags: ["Classrooms"],
    }),
    addClassroom: builder.mutation({
      query: (data) => ({
        url: "/classrooms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Classrooms"],
    }),
    updateClassroom: builder.mutation({
      query: ({ id, data }) => ({
        url: `/classrooms/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Classrooms"],
    }),
    deleteClassroom: builder.mutation({
      query: (id) => ({
        url: `/classrooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classrooms"],
    }),
    bulkUploadClassrooms: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/classrooms/bulk-upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Classrooms"],
    }),
  }),
});

export const {
  useGetClassroomsQuery,
  useAddClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
  useBulkUploadClassroomsMutation,
} = classroomsApi;
