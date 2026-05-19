import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d9488",
          light: "#ccfbf1",
          dark: "#0f766e",
        },
        "background-cream": "#fafaf7",
        surface: "#ffffff",
        "border-gray": "#e5e7eb",
        "text-primary": "#111827",
        "text-secondary": "#6b7280",
        danger: "#f43f5e",
        success: "#10b981",
        warning: "#f59e0b",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "0.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
