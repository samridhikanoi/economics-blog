import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        paper: "#fbfaf8",
        accent: "#8a2c1d",
        muted: "#6b6b6b",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#1a1a1a",
            a: { color: "#8a2c1d" },
            h1: { fontFamily: "Georgia, serif" },
            h2: { fontFamily: "Georgia, serif" },
            h3: { fontFamily: "Georgia, serif" },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
