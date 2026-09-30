import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Cormorant Garamond", "serif"],
      },
      colors: {
        darkbg: "#F7F3E8",
        surface: "#FFFDF8",
        "surface-elevated": "#FFFFFF",
        "surface-border": "#DDD7C8",
        "text-main": "#1A2520",
        "text-secondary": "#69716B",
        "text-muted": "#96958B",
        accent: "#C9A24A",
        "accent-violet": "#9A533B",
        "accent-amber": "#C9A24A",
        "deep-green": "#123C30",
        "green": "#194C3D",
        "soft-green": "#E6EFE9",
        "terracotta": "#9A533B",
        "gold": "#C9A24A"
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
