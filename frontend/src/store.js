import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import medicineReducer from './slices/medicineSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    medicines: medicineReducer,
    orders: orderReducer,
  },
  devTools: true,
});

export default store;
