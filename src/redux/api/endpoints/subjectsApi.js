import { apiSlice } from "../apiSlice";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET ALL SUBJECTS
    getSubjects: builder.query({
      query: () => "/api/subjects",
      providesTags: ["Subjects"],
    }),

    // ✅ ADD SUBJECT (manual entry form)
    addSubject: builder.mutation({
      query: (data) => ({
        url: "/api/subjects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subjects"],
    }),

    // ✅ UPDATE SUBJECT
    updateSubject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/subjects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subjects"],
    }),

    // ✅ DELETE SUBJECT
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/api/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subjects"],
    }),

    // 🔥 BULK UPLOAD (CSV / XLSX)
    bulkUploadSubjects: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/api/subjects/upload", // 👈 backend route check kar lena
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Subjects"],
    }),

  }),
});

export const {
  useGetSubjectsQuery,
  useAddSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useBulkUploadSubjectsMutation,
} = subjectApi;








// import { apiSlice } from "../apiSlice";

// export const subjectApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({

//     getSubjects: builder.query({
//       query: () => "/api/subjects",
//       providesTags: ["Subjects"],
//     }),

//     deleteSubject: builder.mutation({
//       query: (id) => ({
//         url: `/api/subjects/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Subjects"],
//     }),

//     updateSubject: builder.mutation({
//       query: ({ id, data }) => ({
//         url: `/api/subjects/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Subjects"],
//     }),

//   }),
// });

// export const {
//   useGetSubjectsQuery,
//   useDeleteSubjectMutation,
//   useUpdateSubjectMutation,
// } = subjectApi;