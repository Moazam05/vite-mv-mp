import { apiSlice } from "./apiSlice";

export const landingPageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBanners: builder.query({
      query: () => {
        return {
          url: "banners",
          method: "GET",
        };
      },
    }),
    fetchCategories: builder.query({
      query: () => {
        return {
          url: "categories",
          method: "GET",
        };
      },
    }),
    fetchBestSellers: builder.query({
      query: () => {
        return {
          url: "bestsellers",
          method: "GET",
        };
      },
    }),
    fetchHotSellingOffer: builder.query({
      query: () => {
        return {
          url: "categories",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useFetchBannersQuery,
  useFetchCategoriesQuery,
  useFetchBestSellersQuery,
  useFetchHotSellingOfferQuery,
} = landingPageApiSlice;
