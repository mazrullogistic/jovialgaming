const jwt = require("jwt-simple");

// const isValidToken = (accessToken) => {
//   if (!accessToken) {
//     return false;
//   }
//   const decoded = jwtDecode(accessToken);
//   const currentTime = Date.now() / 1000;

//   return decoded.exp > currentTime;
// };

// const handleTokenExpired = (exp, callback) => {
//   if (typeof window !== "undefined") {
//     let expiredTimer;
//     window.clearTimeout(expiredTimer);
//     const currentTime = Date.now();
//     const timeLeft = exp * 1000 - currentTime;
//     expiredTimer = window.setTimeout(() => {
//       callback();
//     }, timeLeft);
//   }
// };

// const setSession = (
//   accessToken,
//   refreshToken = "",
//   callback = null,
//   rTCallback = null
// ) => {
//   if (accessToken) {
//     saveData(STORAGE_KEYS.AUTH_TOKEN, accessToken);
//     saveData(STORAGE_KEYS.AUTH_REFRESH_TOKEN, refreshToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//     const { exp } = jwtDecode(accessToken);
//     const { exp: expRt } = jwtDecode(refreshToken);
//     handleTokenExpired(exp, callback);
//     handleTokenExpired(expRt, rTCallback);
//   } else {
//     removeAll();
//     delete axios.defaults.headers.common.Authorization;
//   }
// };

const encodeData = (data) => jwt.encode(data, "12345");

const decodeData = (encryptedData) =>
  jwt.decode(encryptedData, "12345");

export { encodeData, decodeData };