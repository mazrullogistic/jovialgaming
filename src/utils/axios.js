import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    // process.env.NEXT_APP_HOST_API || "https://admin.jovialgaming.com/api/v1", // Need to unable this before deploy on production
  // process.env.NEXT_APP_HOST_API || "https://staging-new.jovialgaming.com:1337//api/v1",
  process.env.NEXT_APP_HOST_API || "http://localhost:1337/api/v1",

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer token`,
  },
});

export default axiosInstance;
