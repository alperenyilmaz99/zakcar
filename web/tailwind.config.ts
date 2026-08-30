import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2970ff",
          dark: "#1d4ed8",
          light: "#eef4ff",
        },
        ink: {
          DEFAULT: "#121926",
          muted: "#697586",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f5f7fa",
          border: "#e3e8ef",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(18, 25, 38, 0.08)",
        search: "0 8px 32px rgba(18, 25, 38, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
