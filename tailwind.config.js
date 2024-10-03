/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      gray82: "#828282",
      gray6E: "#6E6E6E",
      gray6d: "#6d6d6d",
      gray69: "#696969",
      gray30: "#303030",
      gray33: "#333333",
      black25: "#252525",
      black06: "#060606",
      black26: "#262626",
      white: "#FFFFFF",
      blueF0: "#0391F0",
      green: "#02BF02",
      red: "#FF0000",
      yellow: "#e6d500",
      grayA4: "#a4a4a4",
    },

    extend: {
      fontFamily: {
        archivo: ["var(--font-archivo)"],
        pacifico: ["var(--font-pacifico)"],
        inter_tight: ["var(--font-inter_tight)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.1 },
        },
      },
      animation: {
        blink: "blink 3s infinite",
      },
    },
  },
  plugins: [],
};
