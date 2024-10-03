/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "admin.jovialgaming.com",
      "piracyapp.s3.amazonaws.com",
      "piracyapp.s3.us-west-2.amazonaws.com",
      "52.32.200.186",
    ],
  },
};

export default nextConfig;
