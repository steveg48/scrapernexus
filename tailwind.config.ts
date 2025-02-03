import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '2000px',
        },
      },
      borderRadius: {
        'lg': '0.625rem', // 10px
      },
      colors: {
        'custom-green': '#039625',
        'selected-green': '#206b31',
        'hover-green': '#039625',
        'skill-bg': '#F2F7F2',
        'profile-border': '#E0E0E0'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      }
    },
  },
  plugins: [],
}

export default config
