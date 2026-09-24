import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E30613",
          dark: "#B8000C",
          light: "#FFF1F2",
        },
        ink: {
          DEFAULT: "#111111",
          muted: "#5A5A5A",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#F7F7F7",
          border: "#E6E6E6",
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
