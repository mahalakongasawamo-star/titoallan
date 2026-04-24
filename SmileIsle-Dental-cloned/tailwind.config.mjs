/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Smile Isle Brand Palette
        primary: {
          50: '#eef8f8',
          100: '#d5eeef',
          200: '#aedde0',
          300: '#78B7BB',
          400: '#5fa6ab',
          500: '#438d93',
          600: '#357278',
          700: '#2d5c61',
          800: '#294d51',
          900: '#264145',
          DEFAULT: '#78B7BB',
        },
        secondary: {
          50: '#fef6ee',
          100: '#fdecd8',
          200: '#fad4af',
          300: '#F4A261',
          400: '#f08a3a',
          500: '#ed7321',
          600: '#de5a14',
          700: '#b84312',
          800: '#933617',
          900: '#772e16',
          DEFAULT: '#F4A261',
        },
        cream: {
          50: '#FFFCF7',
          100: '#FFF9F0',
          200: '#FFF3E0',
          300: '#FFECD0',
          DEFAULT: '#FFFCF7',
        },
        navy: {
          DEFAULT: '#1b3a8c',
          light: '#2d6fd4',
          dark: '#0f2460',
        },
        teal: {
          light: '#e6f3f4',
          soft: '#A1D6E6',
          mid: '#82c0c7',
          DEFAULT: '#78B7BB',
          dark: '#004E73',
        },
        gold: {
          DEFAULT: '#D6BE84',
          light: '#e8d9b0',
          dark: '#b89e5e',
        },
        coral: {
          DEFAULT: '#E65A48',
          light: '#f08a7e',
          dark: '#c4402f',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        blob: '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      animation: {
        'pulse-cta': 'pulse-cta 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-cta': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(120, 183, 187, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(120, 183, 187, 0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
