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

export const addPoll = createAsyncThunk(
  "polls/addPoll",
  async ({ title, options }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/poll/add", {
        title,
        options,
      });
      return { ...response.data };
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const updatePoll = createAsyncThunk(
  "polls/updatePoll",
  async ({ pollId, title, options }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/poll/${pollId}`, {
        title,
        options,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const updateOption = createAsyncThunk(
  "polls/updateOption",
  async ({ optionId, optionTitle }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/option/edit/${optionId}`, {
        optionTitle,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const deleteOption = createAsyncThunk(
  "polls/deleteOption",
  async (optionId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/option/delete/${optionId}`);
      return optionId;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const addPollOption = createAsyncThunk(
  "polls/addPollOption",
  async ({ pollId, optionTitle }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/poll/addPollOption/${pollId}`,
        {
          optionTitle,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
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
      })
      .addCase(addPoll.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPoll.fulfilled, (state, action) => {
        state.isLoading = false;
        const newPoll = action.payload;
        if (newPoll.options && Array.isArray(newPoll.options)) {
          state.polls.unshift(newPoll);
        }
      })
      .addCase(addPoll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOption.fulfilled, (state, action) => {
        const updatedOption = action.payload;
        const pollIndex = state.polls.findIndex(
          (poll) => poll.id === updatedOption.pollId
        );
        if (pollIndex !== -1) {
          const optionIndex = state.polls[pollIndex].optionList.findIndex(
            (option) => option.id === updatedOption.id
          );
          if (optionIndex !== -1) {
            state.polls[pollIndex].optionList[optionIndex] = updatedOption;
          }
        }
      })
      .addCase(deleteOption.fulfilled, (state, action) => {
        const optionId = action.payload;
        const pollIndex = state.polls.findIndex(
          (poll) => poll.id === action.payload
        );
        if (pollIndex !== -1) {
          state.polls[pollIndex].optionList = state.polls[
            pollIndex
          ].optionList.filter((option) => option.id !== optionId);
        }
      })
      .addCase(addPollOption.fulfilled, (state, action) => {
        const newOption = action.payload;
        const pollIndex = state.polls.findIndex(
          (poll) => poll.id === newOption.pollId
        );
        if (pollIndex !== -1) {
          state.polls[pollIndex].optionList.push(newOption);
        }
      });
  },
});

export default pollSlice.reducer;
