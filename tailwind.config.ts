import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        geotrexx: {
          crimson: "#C8102E",
          black: "#101114",
          charcoal: "#292A2E",
          grey: "#A7A8AD",
        }
      },
      fontFamily: {
        // Maps to the CSS variables defined in layout.tsx
        sans: ['var(--font-public-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;