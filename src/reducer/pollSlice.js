import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import { PAGE_NO, LIMIT } from "../utils/constant";
import { handleError } from "../utils/errorHandler";

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/poll/list/${PAGE_NO}?limit=${LIMIT}`
      );
      return response.data;
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
        state.polls = action.payload.rows || [];
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
      .addCase(saveVote.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export default pollSlice.reducer;
