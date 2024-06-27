import { apiMVSlice } from "./apiMVSlice";

export const rfqApiSlice = apiMVSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRFQ: builder.mutation({
      query: (data) => {
        return {
          url: "rfq/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["RFQ"],
    }),

    rfqStatusChange: builder.mutation({
      query: ({ body, id }) => {
        return {
          url: `customer/proposal/status/${id}`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["RFQ"],
    }),

    updateGoodsNote: builder.mutation({
      query: ({ body, id }) => {
        return {
          url: `goods/receipt/update/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["RFQ"],
    }),

    dispatchGoodsNote: builder.mutation({
      query: ({ id }) => {
        return {
          url: `goods/receipt/deliver/${id}`,
          method: "POST",
          // body,
        };
      },
      invalidatesTags: ["RFQ"],
    }),

    getGoodsReceiptNote: builder.query({
      query: ({ id }) => {
        return {
          url: `goods/receipt/detail/${id}`,
          method: "GET",
        };
      },
      providesTags: ["RFQ"],
    }),
    submitRFQStatus: builder.query({
      query: ({ id }) => {
        return {
          url: `rfq/submit/${id}`,
          method: "GET",
        };
      },
      providesTags: ["RFQ"],
    }),
  }),
});

export const {
  useCreateRFQMutation,
  useRfqStatusChangeMutation,
  useUpdateGoodsNoteMutation,
  useDispatchGoodsNoteMutation,
  useGetGoodsReceiptNoteQuery,
  useSubmitRFQStatusQuery,
} = rfqApiSlice;
