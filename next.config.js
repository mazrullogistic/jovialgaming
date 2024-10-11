/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_KEY_ID: process.env.SECRET_KEY_ID,
    CLIENT_ID: process.env.CLIENT_ID,
  },

  reactStrictMode: false,
  images: {
    domains: [
      "52.32.200.186",

      "admin.jovialgaming.com",
      "piracyapp.s3.amazonaws.com",
      "piracyapp.s3.us-west-2.amazonaws.com",
    ],
  },
};

// export default nextConfig;
