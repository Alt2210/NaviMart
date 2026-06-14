/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  // PantryDashboard builds status colors dynamically (`text-${color}`), which JIT can't detect.
  safelist: [
    "text-tertiary", "text-secondary", "text-error",
    "bg-tertiary", "bg-secondary", "bg-error",
    "border-tertiary/20", "border-secondary/20", "border-error/20",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#f7fbf0",
        "primary": "#0d631b",
        "on-tertiary-fixed-variant": "#0c5216",
        "tertiary-container": "#3a7b39",
        "outline": "#73796d",
        "surface-tint": "#1b6d24",
        "surface-dim": "#d7dbd2",
        "on-secondary-container": "#653900",
        "surface-container": "#ebefe5",
        "on-secondary-fixed": "#2c1600",
        "on-background": "#181d17",
        "surface-variant": "#e0e4da",
        "primary-fixed-dim": "#88d982",
        "secondary-fixed": "#ffdcbe",
        "error-container": "#ffdad6",
        "on-primary-container": "#cbffc2",
        "secondary-container": "#ff9800",
        "primary-container": "#2e7d32",
        "surface-container-highest": "#e0e4da",
        "surface": "#f7fbf0",
        "on-primary": "#ffffff",
        "primary-fixed": "#a3f69c",
        "surface-container-high": "#e5eadf",
        "on-surface": "#181d17",
        "inverse-primary": "#88d982",
        "outline-variant": "#bfcaba",
        "on-error": "#ffffff",
        "tertiary": "#1f6223",
        "on-error-container": "#93000a",
        "on-secondary-fixed-variant": "#693c00",
        "tertiary-fixed-dim": "#91d78a",
        "on-primary-fixed": "#002204",
        "secondary-fixed-dim": "#ffb870",
        "on-primary-fixed-variant": "#005312",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#40493d",
        "on-tertiary-container": "#c8ffbf",
        "surface-container-low": "#f1f5eb",
        "inverse-surface": "#2d322b",
        "secondary": "#8b5000",
        "tertiary-fixed": "#acf4a4",
        "on-tertiary": "#ffffff",
        "on-secondary": "#ffffff",
        "error": "#cf2e2e",
        "inverse-on-surface": "#eef2e8",
        "surface-bright": "#f7fbf0",
        "on-tertiary-fixed": "#002203"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "gutter-mobile": "12px",
        "stack-md": "16px",
        "nav-height": "69px",
        "stack-sm": "8px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "body-md": ["Be Vietnam Pro", "sans-serif"],
        "label-sm": ["Be Vietnam Pro", "sans-serif"],
        "body-lg": ["Be Vietnam Pro", "sans-serif"],
        "headline-sm": ["Be Vietnam Pro", "sans-serif"],
        "display-sm": ["Be Vietnam Pro", "sans-serif"],
        "display-lg": ["Be Vietnam Pro", "sans-serif"],
        "headline-md": ["Be Vietnam Pro", "sans-serif"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "label-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "26px", fontWeight: "400" }],
        "headline-sm": ["22px", { lineHeight: "30px", fontWeight: "600" }],
        "display-sm": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "display-lg": ["36px", { lineHeight: "44px", fontWeight: "700" }],
        "headline-md": ["28px", { lineHeight: "36px", fontWeight: "700" }]
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
}
