import { apiSlice } from "./apiSlice";

export const footerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAbout: builder.query({
      query: () => {
        return {
          url: "footer/about",
          method: "GET",
        };
      },
    }),

    fetchLinks: builder.query({
      query: () => {
        return {
          url: "footer/link",
          method: "GET",
        };
      },
    }),

    fetchContacts: builder.query({
      query: () => {
        return {
          url: "footer/contact",
          method: "GET",
        };
      },
    }),

    fetchSocials: builder.query({
      query: () => {
        return {
          url: "footer/social",
          method: "GET",
        };
      },
    }),

    fetchPaymentLinks: builder.query({
      query: () => {
        return {
          url: "footer/payment_link",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useFetchAboutQuery,
  useFetchLinksQuery,
  useFetchContactsQuery,
  useFetchSocialsQuery,
  useFetchPaymentLinksQuery,
} = footerApiSlice;
