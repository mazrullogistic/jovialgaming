import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_APP_HOST_API || "https://admin.jovialgaming.com/api/v1",
  //process.env.NEXT_APP_HOST_API || "http://52.32.200.186:1337/api/v1",
  // process.env.NEXT_APP_HOST_API ||
  // "https://fetish-finder-dev.dryrun.click/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer token`,
  },
});

export default axiosInstance;
