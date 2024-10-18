import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get } from "api/base";
import { postFormData } from "api/base";
const initialState = {
  familyLoader: false,
  familyTrainingLogs: [],
  callHistory: [],
  callDetails: [],
  mediaDetails: [],
  trainingLogsCount: 0,
  callDetailsPageCount: 0,
};

export const uploadMediaInstruction = createAsyncThunk("/media/upload-media", async (body) => {
  try {
    const response = await postFormData(`/media/upload-media`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});

export const getTrainingLogs = createAsyncThunk("/media/get-all-media", async (body) => {
  try {
    const response = await get(`/media/get-all-media`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const getCallHistory = createAsyncThunk("/call/get-calls", async () => {
  try {
    const response = await get(`/call/get-calls`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const GetCallDetails = createAsyncThunk("/call/get-call-history", async (body) => {
  try {
    const response = await get(`/call/get-call-history/${body?.id}?page=${body?.page}&limit=100`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const GetMediaDetails = createAsyncThunk("/call/get-photo-gallery", async (body) => {
  try {
    const response = await get(`/call/get-photo-gallery/${body?.id}`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});

export const familySlice = createSlice({
  name: "family",
  initialState: initialState,
  reducers: {
    setCallDetails(state, action) {
      state.callDetails = action.payload; // Update callDetails with the action payload
    },
  },
  extraReducers(builder) {
    builder

      .addCase(uploadMediaInstruction.pending, (state) => {
        state.familyLoader = true;
      })
      .addCase(uploadMediaInstruction.fulfilled, (state, action) => {
        state.familyLoader = false;
      })
      .addCase(uploadMediaInstruction.rejected, (state, action) => {
        state.familyLoader = false;
      })
      .addCase(getCallHistory.pending, (state) => {
        state.familyLoader = true;
      })
      .addCase(getCallHistory.fulfilled, (state, action) => {
        state.callHistory = action.payload.data;
        state.familyLoader = false;
      })
      .addCase(getCallHistory.rejected, (state, action) => {
        state.familyLoader = false;
      })
      .addCase(GetCallDetails.pending, (state) => {
        state.familyLoader = true;
      })
      .addCase(GetCallDetails.fulfilled, (state, action) => {
        if (state.callDetails) {
          state.callDetails = [...state.callDetails, ...action.payload.data];
        } else {
          state.callDetails = state.callDetails;
        }
        state.callDetailsPageCount = action.payload.page_count;
        state.familyLoader = false;
      })
      .addCase(GetCallDetails.rejected, (state, action) => {
        state.familyLoader = false;
      })
      .addCase(GetMediaDetails.pending, (state) => {
        state.familyLoader = true;
      })
      .addCase(GetMediaDetails.fulfilled, (state, action) => {
        state.mediaDetails = action.payload.data;
        state.familyLoader = false;
      })
      .addCase(GetMediaDetails.rejected, (state, action) => {
        state.familyLoader = false;
      })
      .addCase(getTrainingLogs.pending, (state) => {
        state.familyLoader = true;
      })
      .addCase(getTrainingLogs.fulfilled, (state, action) => {
        state.familyTrainingLogs = action.payload.data;
        state.trainingLogsCount = action.payload.count || action.payload.data?.length;
        state.familyLoader = false;
      })
      .addCase(getTrainingLogs.rejected, (state, action) => {
        state.familyLoader = false;
      });
  },
});
export const { setCallDetails } = familySlice.actions;
export default familySlice.reducer;
