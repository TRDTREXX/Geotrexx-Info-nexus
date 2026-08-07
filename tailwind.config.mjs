import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Enables manual and system dark mode switching
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        geo: {
          red: '#C8102E', // GEOTREXX Crimson
          dark: '#0a0b10', // Rich off-black for premium dark mode
          gray: '#1a1b23', // Elevated dark surface
          light: '#f9fafb', // Light mode background
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config