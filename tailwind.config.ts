import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pearl: "#FAF9F7",
        mist: "#F1EFEC",
        ink: "#1A1A1A",
        stone2: "#6B6660",
        hairline: "#E8E4DE",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        mega: "0.35em",
      },
    },
  },
  plugins: [],
};
export default config;
