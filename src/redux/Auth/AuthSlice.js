import { createSlice } from "@reduxjs/toolkit";

import {
  checkUserAction,
  forgotAction,
  forgotPasswordAction,
  loginAction,
  registerAction,
  updatePasswordAction,
  updateProfileAction,
  verifyForgetPasswordAction,
  verifyRegisterAction,
} from "./action";

const initialState = {
  isLoading: false,
  isForgotPassword: false,
  isRestPassword: false,
  isEmailData: "",
  userData: [],
  registerData: [],
  isLoggedIn: false,
  error: null,
};

const AuthSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    resetToInitialState(state) {
      return initialState;
    },
    userData: (state, { payload }) => {
      state.userData = payload;
    },
    setIsForgotPassword: (state, { payload }) => {
      state.isForgotPassword = payload;
    },
    setIsOtp: (state, { payload }) => {
      state.isOtp = payload.isOtp;
      state.isEmailData = payload.email;
    },
    setIsRestPassword: (state, { payload }) => {
      state.isRestPassword = payload.isResetPassword;
      state.isEmailData = payload.email;
    },
    setIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAction.fulfilled, (state, { payload }) => {
        state.registerData = payload;

        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(loginAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(checkUserAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkUserAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(verifyRegisterAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyRegisterAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyRegisterAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(forgotAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      .addCase(updateProfileAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateProfileAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(verifyForgetPasswordAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyForgetPasswordAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyForgetPasswordAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updatePasswordAction.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePasswordAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updatePasswordAction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const authApiSliceReducer = AuthSlice.reducer;

export const {
  userStore,
  resetToInitialState,
  setIsForgotPassword,
  setIsRestPassword,
  setIsLoggedIn,
} = AuthSlice.actions;
