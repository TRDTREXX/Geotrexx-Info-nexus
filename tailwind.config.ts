import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // CRITICAL for next-themes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        geotrexx: {
          red: '#dc2626',
          dark: '#0a0b10',
          light: '#f4f5f7'
        }
      },
      animation: {
        // Fixes the stuck ticker
        'marquee': 'marquee 25s linear infinite', 
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config