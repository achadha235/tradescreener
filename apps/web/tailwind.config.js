/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        sidebar: 200,
      },

      colors: {
        primary: {
          main: "#ffffff",
          contrastText: "#000000",
        },
        secondary: {
          main: "#0819f7",
          contrastText: "rgba(245,241,241,0.87)",
        },
        background: {
          default: "#0A0B0C",
          paper: "#1B1B1B",
        },
        text: {
          primary: "rgba(255,255,255,0.87)",
          secondary: "#c9c9c9",
          disabled: "rgba(47,41,41,0.38)",
        },
        highlight: "#161515",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
};
