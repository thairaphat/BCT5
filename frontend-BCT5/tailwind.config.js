/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FBBD04",
          dark: "#FBBD04",
          light: "#FBBD04",
        },
        secondary: {
          DEFAULT: "#B275F0",
          dark: "#B275F0",
          light: "#B275F0",
        },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        income: "#10b981",
        expense: "#ef4444",
      },
      backgroundImage: {
        'login': "url('https://img2.pic.in.th/pic/tumblr_516d9926dd8917220d20e6b28784c689_3b5761a8_73689c5b96031897f3b.jpg')",
      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};