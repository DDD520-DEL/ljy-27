/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        forest: {
          50: '#f0f7f4',
          100: '#dcefe5',
          200: '#b8dfcb',
          300: '#8bc9aa',
          400: '#59ac85',
          500: '#3a8f68',
          600: '#2D6A4F',
          700: '#25563f',
          800: '#1e4533',
          900: '#183729',
        },
        amber: {
          50: '#fef7ee',
          100: '#fdecd8',
          200: '#fad6b0',
          300: '#f6b97d',
          400: '#F4A261',
          500: '#e8894a',
          600: '#d6713d',
          700: '#b25733',
          800: '#8f462d',
          900: '#743b27',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EBE0D0',
          300: '#DCCBB3',
          400: '#C9B191',
          500: '#B59774',
          600: '#9A7A58',
          700: '#7D6147',
          800: '#654E3B',
          900: '#524031',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
