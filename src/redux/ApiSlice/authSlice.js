import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setSession } from "../../helper/authHelper";
import { post } from "api/base";
import { get } from "api/base";
import { put } from "api/base";
const initialState = {
  user: {},
  authLoader: false,
  status: "idle",
  error: null,
  loginUser: {},
  tokenData: "",
};

export const logIn = createAsyncThunk("auth/sign-in", async ({ name, email, password }) => {
  const body = {
    username: name,
    email: email,
    password: password,
  };
  try {
    const response = await post(`auth/sign-in`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});

export const SendOTP = createAsyncThunk("auth/forgot-password", async ({ email }) => {
  try {
    const response = await post(`carehome/forgot-password`, { email: email });
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const VerifyForgotPasswordOTP = createAsyncThunk(
  "otp/verify-forgot-pass-otp",
  async (body) => {
    try {
      const response = await post(`otp/verify-forgot-pass-otp`, body);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
export const ResetPassword = createAsyncThunk("/auth/reset-password", async (body) => {
  try {
    const response = await post(`/carehome/reset-password`, body);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const GetNewToken = createAsyncThunk("/auth/refresh-token", async () => {
  try {
    const response = await get(`/auth/refresh-token`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const GetCareHomeProfile = createAsyncThunk("/carehome/get-detail", async () => {
  try {
    const response = await get(`/carehome/get-detail`);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
});
export const UpdateCareHomeProfile = createAsyncThunk(
  "/carehome/update-detail",
  async ({ body }) => {
    try {
      const response = await put(`/carehome/update-detail`,body);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);

export const setSessionData = (token, userInfo) => {
  const sessionData = {
    access_token: token,
    userInfo: userInfo,
  };
  setSession(sessionData);
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(logIn.pending, (state) => {
        state.status = "pending";
        state.authLoader = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.authLoader = false;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = "failed";
        state.authLoader = false;
      })
      .addCase(GetNewToken.pending, (state) => {
        state.status = "pending";
        state.authLoader = true;
      })
      .addCase(GetNewToken.fulfilled, (state, action) => {
        state.authLoader = false;
      })
      .addCase(GetNewToken.rejected, (state, action) => {
        state.status = "failed";
        state.authLoader = false;
      })
      .addCase(SendOTP.pending, (state) => {
        state.authLoader = true;
      })
      .addCase(SendOTP.fulfilled, (state, action) => {
        state.authLoader = false;
      })
      .addCase(SendOTP.rejected, (state, action) => {
        state.authLoader = false;
      })
      .addCase(VerifyForgotPasswordOTP.pending, (state) => {
        state.authLoader = true;
      })
      .addCase(VerifyForgotPasswordOTP.fulfilled, (state, action) => {
        state.authLoader = false;
      })
      .addCase(VerifyForgotPasswordOTP.rejected, (state, action) => {
        state.authLoader = false;
      })
      .addCase(ResetPassword.pending, (state) => {
        state.authLoader = true;
      })
      .addCase(ResetPassword.fulfilled, (state, action) => {
        state.authLoader = false;
      })
      .addCase(ResetPassword.rejected, (state, action) => {
        state.authLoader = false;
      })
      .addCase(GetCareHomeProfile.pending, (state) => {
        state.authLoader = true;
      })
      .addCase(GetCareHomeProfile.fulfilled, (state, action) => {
        state.authLoader = false;
      })
      .addCase(GetCareHomeProfile.rejected, (state, action) => {
        state.authLoader = false;
      })
      .addCase(UpdateCareHomeProfile.pending, (state) => {
        state.authLoader = true;
      })
      .addCase(UpdateCareHomeProfile.fulfilled, (state, action) => {
        state.authLoader = false;
      })
      .addCase(UpdateCareHomeProfile.rejected, (state, action) => {
        state.authLoader = false;
      });
  },
});

export default authSlice.reducer;
