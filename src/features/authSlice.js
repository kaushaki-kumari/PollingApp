import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from '../utils/errorHandler';
import toast from 'react-hot-toast';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const login = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful!');
      return data.user;
    } catch (err) {
      const errorMessage = handleError(err);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  toast.success('Logged out successfully');
});

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Email is already registered. Please use a different email.."
        );
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }
      toast.success("Signup successful! Please log in.");
      return data.user;
    } catch (err) {
      const errorMessage =
        err.name === "TypeError" && err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check your connection or try again later."
          : err.message || "An unexpected error occurred.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('user'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;