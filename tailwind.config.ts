import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#ebeef2",
        foreground: "#111317",
        coral: {
          50: "#fff1f0",
          100: "#ffe0df",
          200: "#ffc6c4",
          300: "#ffa09c",
          400: "#ff6c65",
          500: "#f04438",
          600: "#de281b",
          700: "#bb1e12",
          800: "#9a1d13",
          900: "#801e16",
        },
        studio: {
          plate: "#dbe0e7",
          canvas: "#ebeef2",
          surface: "#ffffff",
          950: "#090a0d",
          900: "#111317",
          850: "#191c22",
          800: "#242831",
          700: "#363c48",
          600: "#4d5564",
          500: "#697384",
          400: "#8b96a8",
          300: "#b2bccb",
          200: "#d3d9e3",
          100: "#e9edf3",
          50: "#f6f8fb",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.025em",
        wideDisplay: "0.08em",
        superWide: "0.15em",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
