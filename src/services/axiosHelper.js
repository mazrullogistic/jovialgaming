import axiosInstance from "@/utils/axios";
import { getData, getDataSignUpData } from "@/utils/storage";

export const axiosPost = async (
  url,
  data,
  contentType = "application/json"
) => {
  let response = {};
  const user = getData("user");
  const userData = getDataSignUpData("signUp");
  const userToken = user?.token ? user?.token : userData?.token;
  // console.log("userToken 13", userToken);
  try {
    const result = await axiosInstance.post(url, data, {
      headers: {
        "Content-Type": contentType,
        Authorization: userToken ? `Bearer ${userToken}` : null,
      },
    });
    // console.log("🚀 ~ result:", result);
    response.data = result?.data || result?.data?.data;
    response.status = result?.status;
  } catch (e) {
    response.status = false;
    response.message = e?.response?.data?.message || "something went wrong";
    response.data = e?.response?.data || e;
  }
  // console.log("🚀 ~ response:", response);
  return response;
};

export const axiosGet = async (
  url,
  params = {},
  contentType = "application/json"
) => {
  let response = {};
  const user = getData("user");
  const userData = getDataSignUpData("signUp");
  const userToken = user?.token ? user?.token : userData?.token;
  try {
    const result = await axiosInstance.get(url, {
      headers: {
        "Content-Type": contentType,
        Authorization: userToken ? `Bearer ${userToken}` : null,
      },
      params,
    });
    response.data = result.data;
    response.status = [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message = "something went wrong";
    response.data = e;
  }
  return response;
};

export const axiosPatch = async (
  url,
  data,
  contentType = "application/json"
) => {
  let response = {};
  try {
    const result = await axiosInstance.patch(url, data, {
      headers: {
        "Content-Type": contentType,
      },
    });
    response = result.data;
    response.status = result.data?.status || [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message =
      e?.response?.data?.detail ||
      e?.response?.data?.details ||
      "something went wrong";
    response.data = e;
  }
  return response;
};

export const axiosPut = async (url, data, contentType = "application/json") => {
  let response = {};
  try {
    const result = await axiosInstance.put(url, data, {
      headers: {
        "Content-Type": contentType,
      },
    });
    response = result.data;
    response.status = [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message = "something went wrong";
    response.data = e;
  }
  return response;
};

export const axiosDelete = async (
  url,
  data,
  contentType = "application/json"
) => {
  let response = {};
  try {
    const result = await axiosInstance.delete(url, {
      headers: {
        "Content-Type": contentType,
      },
    });
    response = result.data;
    response.status = [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message = "something went wrong";
    response.data = e;
  }
  return response;
};
