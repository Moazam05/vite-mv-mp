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

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartProducts: getCartProducts(),
  },

  reducers: {
    setProducts(state, action) {
      state.cartProducts = action.payload;
    },
  },
});

export const { setProducts } = cartSlice.actions;
export default cartSlice.reducer;
