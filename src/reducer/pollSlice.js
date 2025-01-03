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
        currentPage: pageNo,
      };
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

const pollSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [],
    isLoading: false,
    error: null,
    votes: JSON.parse(localStorage.getItem("votes")) || {},
    currentPage: PAGE_NO,
    totalPages: 1,
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
        const { rows, totalCount, currentPage } = action.payload;
        const newPolls = rows.filter(
          (newPoll) =>
            !state.polls.some((existingPoll) => existingPoll.id === newPoll.id)
        );
        if (rows.length < LIMIT) {
          state.hasMore = false;
        }
        state.polls = [...state.polls, ...newPolls];
        state.currentPage = currentPage;
        state.totalPages = Math.ceil(totalCount / LIMIT);

        if (rows.length < LIMIT) {
          state.hasMore = false;
        }
      })

      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(saveVote.fulfilled, (state, action) => {
        const { pollId, optionId, userId } = action.payload;
        if (!state.votes[pollId]) {
          state.votes[pollId] = {};
        }
        state.votes[pollId][userId] = optionId;
        const pollIndex = state.polls.findIndex((poll) => poll.id === pollId);
        if (pollIndex !== -1) {
          const optionIndex = state.polls[pollIndex].optionList.findIndex(
            (option) => option.id === optionId
          );
          if (optionIndex !== -1) {
            state.polls[pollIndex].optionList[optionIndex].voteCount.push(
              userId
            );
          }
        }
        localStorage.setItem("votes", JSON.stringify(state.votes));
      })
      .addCase(saveVote.rejected, (_, action) => {
        console.error(action.payload);
      });
  },
});

export default pollSlice.reducer;
