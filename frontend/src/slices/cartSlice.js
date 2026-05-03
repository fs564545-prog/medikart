import { createSlice } from '@reduxjs/toolkit';

const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const getStorageItem = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    return item && item !== 'undefined' ? JSON.parse(item) : defaultVal;
  } catch (err) {
    return defaultVal;
  }
};

const initialState = {
  cartItems: getStorageItem('cartItems', []),
  shippingAddress: getStorageItem('shippingAddress', {}),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add or update item — works with both id & _id
    addToCart: (state, action) => {
      const incoming = action.payload;
      const uid = incoming.id ?? incoming._id;
      const existIdx = state.cartItems.findIndex(
        (x) => (x.id ?? x._id) === uid
      );
      if (existIdx >= 0) {
        // Increase qty (cap at countInStock or 10)
        const max = incoming.countInStock ?? 10;
        state.cartItems[existIdx].qty = Math.min(
          (state.cartItems[existIdx].qty || 1) + 1,
          max
        );
      } else {
        state.cartItems.push({ ...incoming, qty: incoming.qty ?? 1 });
      }
      save('cartItems', state.cartItems);
    },

    // Remove one item
    removeFromCart: (state, action) => {
      const uid = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => (x.id ?? x._id) !== uid
      );
      save('cartItems', state.cartItems);
    },

    // Update qty for one item
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => (x.id ?? x._id) === id);
      if (item) {
        item.qty = qty < 1 ? 1 : qty;
      }
      save('cartItems', state.cartItems);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      save('shippingAddress', state.shippingAddress);
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQty,
  saveShippingAddress,
  clearCartItems,
} = cartSlice.actions;

// Selectors
export const selectCartCount = (state) =>
  state.cart.cartItems.reduce((acc, x) => acc + (x.qty ?? 1), 0);

export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce(
    (acc, x) => acc + x.price * (x.qty ?? 1),
    0
  );

export default cartSlice.reducer;
