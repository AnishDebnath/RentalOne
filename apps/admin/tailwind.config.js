import forms from '@tailwindcss/forms';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#050505',
          hover: '#1F2937',
          light: '#F4F7FB',
          dark: '#111827',
        },
        page: '#F5F3F0',
        card: '#FFFFFF',
        ink: '#121212',
        muted: '#7B7F87',
        tertiary: '#A2A7B0',
        line: '#ECEFF3',
        success: '#14B86E',
        warning: '#E5A027',
        danger: '#E45151',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
        pill: '100px',
        input: '8px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [forms],
};
