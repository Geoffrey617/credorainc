import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Override default font families to use serif
        sans: ['Georgia', '"Times New Roman"', 'Times', 'serif'],
        serif: ['Georgia', '"Times New Roman"', 'Times', 'serif'],
        mono: ['Georgia', '"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
