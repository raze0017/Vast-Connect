/** @type {import('tailwindcss').Config} */
import daisyUi from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        pulse: "pulse 1s infinite",
      },
    },
  },
  plugins: [daisyUi],
  daisyui: {
    themes: ["forest"], // Add the cyberpunk theme here
  },
};
