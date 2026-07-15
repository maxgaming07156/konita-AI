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
        base: {
          950: "#050E0B",
          900: "#081713",
          800: "#0D211B",
          700: "#132E25",
          600: "#1B3E32",
        },
        emerald: {
          950: "#032015",
          900: "#054431",
          800: "#0A6847",
          700: "#0F8A5F",
          600: "#16A876",
          500: "#22C58E",
          400: "#4FDBA8",
          300: "#84E8C2",
          200: "#B8F4DC",
        },
        mist: {
          100: "#F1FBF6",
          200: "#DCEFE6",
          300: "#AFC9BE",
          400: "#7E9C90",
          500: "#5B7B70",
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
