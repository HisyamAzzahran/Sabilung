/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "var(--font-sans)", "sans-serif"],
        body: ["'Inter'", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#ECF4FF",
          100: "#D1E4FF",
          200: "#A3C9FF",
          300: "#74ADFF",
          400: "#4692FF",
          500: "#1A76FF",
          600: "#005BE6",
          700: "#0045B3",
          800: "#003080",
          900: "#001C4D",
        },
        danger: {
          light: "#FCA5A5",
          DEFAULT: "#F87171",
          dark: "#DC2626",
        },
        safe: "#14B8A6",
      },
      boxShadow: {
        glow: "0 0 40px rgba(26, 118, 255, 0.35)",
      },
      borderRadius: {
        "4xl": "2.5rem",
      },
    },
  },
  plugins: [],
}
