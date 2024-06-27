import { apiSlice } from "./apiSlice";

export const cmsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaticPages: builder.query({
      query: () => {
        return {
          url: "pages",
          method: "GET",
        };
      },
    }),

    getBlogs: builder.query({
      query: () => {
        return {
          url: "blogs",
          method: "GET",
        };
      },
    }),

    getSingleBlog: builder.query({
      query: (slug) => {
        return {
          url: `blog/${slug}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetStaticPagesQuery,
  useGetBlogsQuery,
  useGetSingleBlogQuery,
} = cmsApiSlice;
