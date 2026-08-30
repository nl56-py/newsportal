import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sawal: {
          red: "#dc133d",
          darkred: "#b80f33",
          lightred: "#fff5f6",
          blue: "#0e2a47",
          darkblue: "#0a1f34",
          footer: "#0f2d24",
          darkfooter: "#0a1f18",
          bg: "#f4f6f8",
          card: "#ffffff",
          text: "#222222",
          muted: "#666666",
          border: "#e2e8f0",
        },
        brand: {
          red: "#dc133d",
          darkred: "#b80f33",
          lightred: "#fff5f6",
          navy: "#0e2a47",
          dark: "#111827",
          gray: "#f4f6f8",
          border: "#e2e8f0",
          muted: "#6b7280",
          gold: "#d97706",
          blue: "#1d4ed8",
        },
      },
      fontFamily: {
        mukta: ["var(--font-mukta)", "sans-serif"],
        martel: ["var(--font-martel)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-down": "slideDown 0.25s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
