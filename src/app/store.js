import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducer/authSlice';
import pollReducer from "../reducer/pollSlice";
import usersReducer from "../reducer/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollReducer,
    users: usersReducer,
  },
});

