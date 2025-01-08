import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance"; 
import { handleError } from "../utils/errorHandler";
import { POLL_LIMIT } from "../utils/constant";  

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ pageNo = 1 }, { rejectWithValue }) => {  
    try {
      const response = await axiosInstance.get(
        `/user/list/${pageNo}?limit=${POLL_LIMIT}`  
      );
      return {
        rows: response.data.rows,
        totalCount: response.data.count,
        currentPage: pageNo,
      };
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalCount: 0,
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
        const { rows, currentPage, totalCount } = action.payload;
        state.hasMore = rows.length > 0 && state.users.length + rows.length < totalCount;
        state.users = [...state.users, ...rows];
        state.currentPage = currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
