/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FBBD04", // blue-500
          dark: "#FBBD04", // blue-600
          light: "#FBBD04", // blue-400
        },
        secondary: {
          DEFAULT: "#B275F0", // gray-500
          dark: "#B275F0", // gray-600
          light: "#B275F0", // gray-400
        },
        success: "#10b981", // green-500
        danger: "#ef4444", // red-500
        warning: "#f59e0b", // amber-500
        income: "#10b981", // green-500
        expense: "#ef4444", // red-500
      },
      backgroundImage: {
        'login': "url('https://img2.pic.in.th/pic/tumblr_516d9926dd8917220d20e6b28784c689_3b5761a8_73689c5b96031897f3b.jpg')",

      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
