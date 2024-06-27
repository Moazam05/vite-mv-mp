// Redux Toolkit Imports
import { createSlice } from "@reduxjs/toolkit";

const getCartProducts = () => {
  const localStorageItem = localStorage.getItem("cartProducts");
  if (localStorageItem) {
    return JSON.parse(localStorageItem);
  } else {
    return [];
  }
};

const getQouteProducts = () => {
  const localStorageItem = localStorage.getItem("qouteProducts");
  if (localStorageItem) {
    return JSON.parse(localStorageItem);
  } else {
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartProducts: getCartProducts(),
    qouteProducts: getQouteProducts(),
  },

  reducers: {
    setProducts(state, action) {
      state.cartProducts = action.payload;
    },

    setQuoteProducts(state, action) {
      state.qouteProducts = action.payload;
    },
  },
});

export const { setProducts, setQuoteProducts } = cartSlice.actions;
export default cartSlice.reducer;
