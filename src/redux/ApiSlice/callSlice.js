import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get } from "api/base";
import { post } from "api/base";
const initialState = {
  callLoader: false,
  meeting: [],
};

export const receiveCall = createAsyncThunk("/call/receive-call", async (body) => {
  try {
    const response = await post(`/call/receive-call`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const scheduleCall = createAsyncThunk("/call/schedule-call", async ({ body }) => {
  try {
    const response = await post(`/call/schedule-call`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const getScheduleCallList = createAsyncThunk("/call/list-scheduled-calls", async () => {
  try {
    const response = await get(`/call/list-scheduled-calls`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const trainCallBot = createAsyncThunk(
  "/patients/add-call-time-duration",
  async (call_id) => {
    try {
      const response = await get(`/patients/add-call-time-duration?scheduled_id=${call_id}`);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);

export const callSlice = createSlice({
  name: "call",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(scheduleCall.pending, (state) => {
        state.callLoader = true;
      })
      .addCase(scheduleCall.fulfilled, (state, action) => {
        state.callLoader = false;
      })
      .addCase(scheduleCall.rejected, (state, action) => {
        state.callLoader = false;
      })

      .addCase(getScheduleCallList.pending, (state) => {
        state.callLoader = true;
      })
      .addCase(getScheduleCallList.fulfilled, (state, action) => {
        const meetings =
          action.payload.data &&
          Array?.isArray(action.payload.data) &&
          action.payload.data?.map((call) => ({
            id: call?.id, // Use the id from the API
            title: call?.title, // Placeholder title
            patient: {
              value: call?.patient_id, // Use patient_id from the API
              label: call?.patient?.first_name + " " + call?.patient?.last_name, // Placeholder name, replace with actual data if available
            },
            description: call?.description,
            start: call.call_time,
            end: call?.call_time,
          }));
        state.callLoader = false;
        if (action?.payload?.success) {
          state.meeting = meetings || [];
        }
      })
      .addCase(getScheduleCallList.rejected, (state, action) => {
        state.callLoader = false;
      });
  },
});

export default callSlice.reducer;
