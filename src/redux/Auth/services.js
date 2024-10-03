import { axiosPost } from "@/services/axiosHelper";
import { API_ROUTER } from "@/services/apiRouter";

export const RegisterUser = (data) => {
  return axiosPost(API_ROUTER.REGISTER_USER, data);
};

export const LoginUser = (data) => {
  return axiosPost(API_ROUTER.LOGIN_USER, data);
};

export const CheckUserNameExist = (data) => {
  return axiosPost(API_ROUTER.CHECK_USERNAME_EXIST, data);
};
export const UpdateProfile = (data) => {
  return axiosPost(API_ROUTER.UPDATE_PROFILE, data);
};
export const VerifyRegisterCode = (data) => {
  return axiosPost(API_ROUTER.VERIFY_REGISTER_CODE, data);
};

export const ForgetPasswordUser = (data) => {
  return axiosPost(API_ROUTER.FORGET_PASSWORD_USER, data);
};

export const resetPassword = (data) => {
  return axiosPost(API_ROUTER.FORGOT_PASSWORD, data);
};
export const forgotPassword = (data) => {
  return axiosPost(API_ROUTER.FORGOT_PASSWORD, data);
};
export const updatePassword = (data) => {
  return axiosPost(API_ROUTER.UPDATE_PASSWORD, data);
};
export const verifyForgetPassword = (data) => {
  return axiosPost(API_ROUTER.VERIFY_FORGET_PASSWORD_CODE, data);
};
