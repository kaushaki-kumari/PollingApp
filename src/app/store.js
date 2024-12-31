import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import pollReducer from "../features/pollSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollReducer,
  },
});

