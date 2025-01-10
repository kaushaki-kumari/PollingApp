import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance"; 
import { handleError } from "../utils/errorHandler";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ pageNo = 1, pageSize=10 }, { rejectWithValue }) => {  
    try {
      const response = await axiosInstance.get(
        `/user/list/${pageNo}?limit=${pageSize}`  
      );
      return {
        rows: response.data.rows,
        totalCount: response.data.count,
        currentPage: pageNo,
        pageSize,
      };
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "users/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/role/list");
      return response.data;  
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/create", userData);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      if (err.response?.status === 500) {
        return rejectWithValue("This email is already registered. Please use a different email.");
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    roles:[],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalCount: 0,
    totalPages:0,
    hasMore: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        const { rows, currentPage, totalCount , pageSize} = action.payload;
        state.users = rows;
        state.totalCount = totalCount;
        state.currentPage = currentPage;
        state.totalPages = Math.ceil(totalCount/pageSize);
        state.hasMore = currentPage < state.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
