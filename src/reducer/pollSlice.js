import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import { PAGE_NO, LIMIT } from "../utils/constant";
import { handleError } from "../utils/errorHandler";

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (pageNo = PAGE_NO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/poll/list/${pageNo}?limit=${LIMIT}`
      );
      return {
        rows: response.data.rows,
        totalCount: response.data.count,
        currentPage: pageNo
      };
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveVote = createAsyncThunk(
  "polls/saveVote",
  async ({ pollId, optionId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/vote/count`, 
        { pollId, optionId }
      );
      return { pollId, optionId, response: response.data };
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

const pollSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [],
    isLoading: false,
    error: null,
    votes: JSON.parse(localStorage.getItem("votes")) || {},
    currentPage: PAGE_NO,
    totalPages: 1,
    hasMore: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.currentPage === PAGE_NO) {
          state.polls = action.payload.rows;
        } else {
          state.polls = [...state.polls, ...action.payload.rows];
        }
        state.currentPage = action.payload.currentPage;
        state.totalPages = Math.ceil(action.payload.totalCount / LIMIT);
        const totalItems = action.payload.totalCount;
        const currentItems = state.polls.length;
        state.hasMore = currentItems < totalItems;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(saveVote.fulfilled, (state, action) => {
        const { pollId, optionId } = action.payload;
        state.votes[pollId] = optionId;
        localStorage.setItem("votes", JSON.stringify(state.votes));
      })
      .addCase(saveVote.rejected, (_, action) => {
        console.error(action.payload);
      });
  },
});

export default pollSlice.reducer;
