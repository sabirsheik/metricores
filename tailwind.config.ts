import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Geist"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        xs: "0.85rem",
        sm: "0.975rem",
        base: "1.125rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "1.875rem",
        "3xl": "2.375rem",
        "4xl": "3rem",
        "5xl": "3.75rem",
        "6xl": "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;