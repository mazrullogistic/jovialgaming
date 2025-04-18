/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_KEY_ID: process.env.SECRET_KEY_ID,
    CLIENT_ID: process.env.CLIENT_ID,

    V_API_KEY: process.env.V_API_KEY,
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
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
  webpack: (config) => {
    // Add rule for .glb and .gltf files

    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            outputPath: "static/models/",
            publicPath: "/_next/static/models/",
            name: "[name].[hash].[ext]",
          },
        },
      ],
    });

    return config;
  },
  i18n: {
    locales: ["en"], // Specify the supported locales (e.g., 'en', 'fr')
    defaultLocale: "en", // Set the default locale
    localeDetection: false, // Disable automatic locale detection to prevent redirects
  },
};

// export default nextConfig;
