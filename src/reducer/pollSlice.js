import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import { POLL_LIMIT } from "../utils/constant";
import { handleError } from "../utils/errorHandler";

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (pageNo = 1, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/poll/list/${pageNo}?limit=${POLL_LIMIT}`
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

export const fetchPollDetails = createAsyncThunk(
  "polls/fetchPollDetails",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/poll/${pollId}`);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveVote = createAsyncThunk(
  "polls/saveVote",
  async ({ pollId, optionId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/vote/count`, {
        optionId,
      });
      return { pollId, optionId, userId, response: response.data };
    } catch (err) {
      const errorMessage = handleError(err);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deletePoll = createAsyncThunk(
  "polls/deletePoll",
  async (pollId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/poll/${pollId}`);
      return pollId;
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
    currentPage: 1,
    hasMore: true,
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
        const { rows, currentPage } = action.payload;
        if (rows.length < POLL_LIMIT) {
          state.hasMore = false;
        }
        state.polls = [...state.polls, ...rows];
        state.currentPage = currentPage;
      })

      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchPollDetails.fulfilled, (state, action) => {
        state.currentPollDetails = action.payload;
      })
      .addCase(fetchPollDetails.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(saveVote.rejected, (_, action) => {
        console.error(action.payload);
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        const pollId = action.payload;
        state.polls = state.polls.filter((poll) => poll.id !== pollId);
      })
      .addCase(deletePoll.rejected, (_, action) => {
        console.error(action.payload);
      });
  },
});

export default pollSlice.reducer;
