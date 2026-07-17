import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--color-white) / <alpha-value>)",
        black: "rgb(var(--color-black) / <alpha-value>)",
        base: {
          950: "rgb(var(--color-base-950) / <alpha-value>)",
          900: "rgb(var(--color-base-900) / <alpha-value>)",
          800: "rgb(var(--color-base-800) / <alpha-value>)",
          700: "rgb(var(--color-base-700) / <alpha-value>)",
          600: "rgb(var(--color-base-600) / <alpha-value>)",
        },
        emerald: {
          950: "rgb(var(--color-emerald-950) / <alpha-value>)",
          900: "rgb(var(--color-emerald-900) / <alpha-value>)",
          800: "rgb(var(--color-emerald-800) / <alpha-value>)",
          700: "rgb(var(--color-emerald-700) / <alpha-value>)",
          600: "rgb(var(--color-emerald-600) / <alpha-value>)",
          500: "rgb(var(--color-emerald-500) / <alpha-value>)",
          400: "rgb(var(--color-emerald-400) / <alpha-value>)",
          300: "rgb(var(--color-emerald-300) / <alpha-value>)",
          200: "rgb(var(--color-emerald-200) / <alpha-value>)",
        },
        mist: {
          100: "rgb(var(--color-mist-100) / <alpha-value>)",
          200: "rgb(var(--color-mist-200) / <alpha-value>)",
          300: "rgb(var(--color-mist-300) / <alpha-value>)",
          400: "rgb(var(--color-mist-400) / <alpha-value>)",
          500: "rgb(var(--color-mist-500) / <alpha-value>)",
          600: "rgb(var(--color-mist-600) / <alpha-value>)",
          700: "rgb(var(--color-mist-700) / <alpha-value>)",
          800: "rgb(var(--color-mist-800) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(34,197,142,0.16) 0%, rgba(5,14,11,0) 70%)",
        "grain-fade":
          "linear-gradient(180deg, rgba(5,14,11,0) 0%, rgba(5,14,11,0.9) 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(79,219,168,0.12), 0 8px 40px -8px rgba(34,197,142,0.35)",
        "glow-sm": "0 0 0 1px rgba(79,219,168,0.10), 0 4px 20px -6px rgba(34,197,142,0.25)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -20px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        wave: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        wave: "wave 8s linear infinite",
        rise: "rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
