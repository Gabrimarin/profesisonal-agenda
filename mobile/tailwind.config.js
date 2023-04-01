/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        primary: "#000000",
        secondary: "#3F51B5",
        success: "#66BB6A",
        error: "#F44336",
        warning: "#FFC107",
        info: "#2196F3",
        light: "#F5F5F5",
        dark: "#333",
        text: {
          primary: "#212121",
          secondary: "#757575",
          disabled: "#BDBDBD",
          hint: "#9E9E9E",
        },
      },
    },
  },
  plugins: [],
};
