const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kimberley: ["Kimberley", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        buzzer: "0 0 50px 0 rgba(0, 0, 0, 0.4)",
        "buzzer-pressed": "0 0 40px -10px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
