import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../utils/errorHandler";
import toast from "react-hot-toast";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/user/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...response.data.user,
          token: response.data.token,
        })
      );
      toast.success("Login successful!");
      return { ...response.data.user, token: response.data.token };
    } catch (err) {
      const errorMessage = handleError(err);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
});

export const fetchRoles = createAsyncThunk(
  "auth/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/role/list`);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/user/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Email is already registered. Please use a different email."
        );
      }
      toast.success("Signup successful! Please log in.");
      return response.data.user;
    } catch (err) {
      const errorMessage =
        err.response?.data || err.message || "An unexpected error occurred.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("user"),
  roles: [],
  rolesLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null; // Reset error state
    },
  },
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
      .addCase(fetchRoles.pending, (state) => {
        state.rolesLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.error = action.payload;
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
        console.log("Signup error:", action.payload);
        state.error = action.payload;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
