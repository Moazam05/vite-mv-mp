import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiMVSlice = createApi({
  reducerPath: "mvApi", // Ensure unique and descriptive reducerPath

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_MV_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token =
        getState().auth?.user?.token || localStorage.getItem("mp-user-token");
      if (token) {
        headers.set("authorization", `Token ${token}`);
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
      }
      return headers;
    },
  }),
  tagTypes: ["RFQ"], // Define tag types as needed
  endpoints: () => ({}), // Define endpoints as needed
});
