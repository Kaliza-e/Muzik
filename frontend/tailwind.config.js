/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#070812',
        navy: '#0B0D1F',
        plum: '#1D0F2C',
        'glow-indigo': '#1D1B52',
        'glow-crimson': '#4A1236',
        accent: {
          DEFAULT: '#FF3D81',
          text: '#FF5C93',
        },
        muted: '#B4B2CC',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'btn': '20px',
        'card': '28px',
        'card-lg': '36px',
        'pill': '999px',
      },
      keyframes: {
        wave1: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(120px,80px)' },
        },
        wave2: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(-100px,-60px)' },
        },
        pulseHotspot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.5' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        wave1: 'wave1 14s ease-in-out infinite',
        wave2: 'wave2 18s ease-in-out infinite',
        hotspot: 'pulseHotspot 2s ease-in-out infinite',
        floatSubtle: 'floatSubtle 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
