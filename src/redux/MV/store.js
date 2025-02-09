// Redux Toolkit Imports
import { configureStore } from "@reduxjs/toolkit";
// Custom Imports
import authReducer from "./auth/authSlice";
import cartReducer from "./cart/cartSlice";
import { apiSlice } from "./api/apiSlice";
import { apiMVSlice } from "./api/apiMVSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // For API Integration
    [apiMVSlice.reducerPath]: apiMVSlice.reducer, // For API Integration

    auth: authReducer,
    cart: cartReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(apiSlice.middleware, apiMVSlice.middleware), // Include middleware for both API slices
});
