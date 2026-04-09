/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B3A6B",
        secondary: "#C9A84C",
        success: "#16A34A",
        danger: "#DC2626",
        warning: "#D97706",
      },
    },
  },
  plugins: [],
}
