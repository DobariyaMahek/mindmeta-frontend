import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { put } from "api/base";
import { del } from "api/base";
import { get } from "api/base";
import { post } from "api/base";
import { authHeader } from "helper/authHelper";
const initialState = {
  patientLoader: false,
  chatLoader: false,
  patientInfo: [],
};

export const GetActivePatientInfo = createAsyncThunk(
  "/patients/list-and-search-patients",
  async ({ search, page, limit }) => {
    try {
      const response = await get(
        `/patients/list-and-search-patients?page=${page}&limit=${limit}${
          search && `&name=${search}`
        }`
      );
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
export const createPatient = createAsyncThunk("/patients/add-patient", async (body) => {
  try {
    const response = await post(`patients/add-patient`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const createFamilyMember = createAsyncThunk(
  "/patients/add-family-member",
  async ({ id, body }) => {
    try {
      const response = await post(`/patients/add-family-member/${id}`, body);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
export const updatePatient = createAsyncThunk("/patients/edit-patient", async ({ id, body }) => {
  try {
    const response = await put(`/patients/edit-patient/${id}`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const deletePatient = createAsyncThunk("/patients/delete-patient", async ({ id }) => {
  try {
    const response = await del(`/patients/delete-patient/${id}`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const deleteMember = createAsyncThunk(
  "/patients/delete-family-member",
  async ({ memberId }) => {
    try {
      const response = await del(`/patients/delete-family-member/${memberId}`);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
export const getPatientById = createAsyncThunk("/patients/get-patient", async ({ id }) => {
  try {
    const response = await get(`/patients/get-patient/${id}`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});

export const uploadPatientInfo = createAsyncThunk("/bots/train-bot", async ({ body }) => {
  try {
    const response = await post(`/bots/train-bot`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const createCallHistory = createAsyncThunk("/call/create-call-history", async (body) => {
  try {
    const response = await post(`/call/create-call-history`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const getAllChat = createAsyncThunk("/chat", async (id) => {
  try {
    const response = await get(`/bots/chat-history/${id}`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const patientSlice = createSlice({
  name: "patient",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(GetActivePatientInfo.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(GetActivePatientInfo.fulfilled, (state, action) => {
        state.patientLoader = false;
        if (action?.payload?.success) {
          state.patientInfo = action.payload.data || [];
          state.totalPatients = action.payload.count || [];
        }
      })
      .addCase(GetActivePatientInfo.rejected, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(createPatient.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(createFamilyMember.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(createFamilyMember.fulfilled, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(createFamilyMember.rejected, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(updatePatient.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.patientLoader = false;
      })

      .addCase(deletePatient.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(deleteMember.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(getPatientById.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(getPatientById.fulfilled, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(getPatientById.rejected, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(uploadPatientInfo.pending, (state) => {
        state.patientLoader = true;
      })
      .addCase(uploadPatientInfo.fulfilled, (state, action) => {
        state.patientLoader = false;
      })
      .addCase(uploadPatientInfo.rejected, (state, action) => {
        state.patientLoader = false;
      })

      .addCase(getAllChat.pending, (state) => {
        state.chatLoader = true;
      })
      .addCase(getAllChat.fulfilled, (state, action) => {
        state.chatLoader = false;
      })
      .addCase(getAllChat.rejected, (state, action) => {
        state.chatLoader = false;
      });
  },
});

export default patientSlice.reducer;
