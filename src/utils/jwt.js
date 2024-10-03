const jwt = require("jwt-simple");

const encodeData = (data) => jwt.encode(data, "12345");

const decodeData = (encryptedData) => jwt.decode(encryptedData, "12345");

export { encodeData, decodeData };
