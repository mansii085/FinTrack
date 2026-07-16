/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#080B12",
          soft: "#0D1119",
        },
        surface: {
          DEFAULT: "#12161F",
          elevated: "#1A2030",
          border: "rgba(255,255,255,0.07)",
        },
        mint: {
          DEFAULT: "#34E5A8",
          dim: "#1F8F6C",
          glow: "rgba(52,229,168,0.35)",
        },
        indigo: {
          DEFAULT: "#818CF8",
          dim: "#4C4FBD",
        },
        rose: {
          DEFAULT: "#FB7185",
          dim: "#9F3A4C",
        },
        amber: {
          DEFAULT: "#FBBF6B",
        },
        ink: {
          DEFAULT: "#F1F5F9",
          muted: "#8A93A6",
          faint: "#5B6376",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35)",
        glow: "0 0 40px rgba(52,229,168,0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(6px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        floatUp: "floatUp 0.5s ease-out both",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
