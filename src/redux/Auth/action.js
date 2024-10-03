import { createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import { saveData } from "@/utils/storage";
import {
  CheckUserNameExist,
  ForgetPasswordUser,
  LoginUser,
  RegisterUser,
  UpdateProfile,
  VerifyRegisterCode,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyForgetPassword,
} from "./services";

export const registerAction = createAsyncThunk(
  "authSlice/registerAction",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ payload:", payload);
      const { data, status } = await RegisterUser(payload);
      console.log("data=====>", data);

      if (data.token) {
        // localStorage.setItem("user", JSON.stringify(data));
        saveData("user", data);
      }
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      if (err) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const checkUserAction = createAsyncThunk(
  "authSlice/checkUserAction",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ payload:", payload);
      const { data, status } = await CheckUserNameExist(payload);
      console.log("data=====>", data);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      if (err) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const forgotAction = createAsyncThunk(
  "authSlice/forgotAction",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ payload:", payload);
      const { data, status } = await forgotPassword(payload);
      console.log("data=====>", data);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      if (err) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const updateProfileAction = createAsyncThunk(
  "authSlice/updateProfileAction",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ payload:", payload);
      const { data, status } = await UpdateProfile(payload);
      console.log("data=====>", data);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      if (err) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const verifyRegisterAction = createAsyncThunk(
  "authSlice/verifyRegisterAction",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ payload:", payload);
      const { data, status } = await VerifyRegisterCode(payload);
      console.log("data=====>", data);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      if (err) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const loginAction = createAsyncThunk(
  "authSlice/loginAction",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ payload:", payload);
      const { data, status } = await LoginUser(payload);
      console.log("data=====>", data);
      console.log("data.token=====>", data.token);
      if (data.token) {
        // localStorage.setItem("user", JSON.stringify(data));
        saveData("user", data);
      }
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      if (err) {
        return rejectWithValue();
      }
      return rejectWithValue(err.message);
    }
  }
);

export const forgotPasswordAction = createAsyncThunk(
  "authSlice/forgotPasswordAction",
  async (payload, { rejectWithValue }) => {
    try {
      // console.log("🚀 ~ payload:", payload);
      const { data, status } = await ForgetPasswordUser(payload);

      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const updatePasswordAction = createAsyncThunk(
  "authSlice/updatePasswordAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await updatePassword(payload);
      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const verifyForgetPasswordAction = createAsyncThunk(
  "authSlice/verifyForgetPasswordAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await verifyForgetPassword(payload);
      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
