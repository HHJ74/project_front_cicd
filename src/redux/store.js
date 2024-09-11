import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // 1. slice import
import apiReducer from './slices/apiSlice';

const store = configureStore({
  // 2. store에 slice 등록
  reducer: {
    auth: authReducer,
    api: apiReducer,
  },
});

export default store;
