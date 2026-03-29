import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))'
        },
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))'
        },
        // Candle brand colors
        violet: {
          50: 'oklch(0.97 0.04 290)',
          100: 'oklch(0.93 0.08 290)',
          200: 'oklch(0.85 0.12 290)',
          300: 'oklch(0.75 0.16 290)',
          400: 'oklch(0.65 0.20 290)',
          500: 'oklch(0.55 0.22 290)',
          600: 'oklch(0.45 0.22 290)',
          700: 'oklch(0.38 0.20 290)',
          800: 'oklch(0.28 0.16 290)',
          900: 'oklch(0.20 0.10 290)',
        },
        pink: {
          50: 'oklch(0.97 0.04 340)',
          100: 'oklch(0.93 0.08 340)',
          200: 'oklch(0.87 0.12 340)',
          300: 'oklch(0.80 0.16 340)',
          400: 'oklch(0.72 0.20 340)',
          500: 'oklch(0.65 0.22 340)',
          600: 'oklch(0.55 0.22 340)',
          700: 'oklch(0.45 0.20 340)',
          800: 'oklch(0.35 0.16 340)',
          900: 'oklch(0.25 0.10 340)',
        },
        blue: {
          50: 'oklch(0.97 0.03 250)',
          100: 'oklch(0.93 0.06 250)',
          200: 'oklch(0.85 0.10 250)',
          300: 'oklch(0.75 0.14 250)',
          400: 'oklch(0.65 0.18 250)',
          500: 'oklch(0.55 0.20 250)',
          600: 'oklch(0.45 0.20 250)',
          700: 'oklch(0.38 0.18 250)',
          800: 'oklch(0.28 0.14 250)',
          900: 'oklch(0.20 0.10 250)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        glow: '0 0 20px oklch(0.65 0.22 290 / 0.3), 0 0 40px oklch(0.65 0.22 340 / 0.2)',
        'glow-lg': '0 0 30px oklch(0.65 0.22 290 / 0.4), 0 0 60px oklch(0.65 0.22 340 / 0.3)',
        'card-hover': '0 8px 30px oklch(0.45 0.22 290 / 0.15)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1) rotate(-1deg)', opacity: '1' },
          '25%': { transform: 'scaleY(1.05) scaleX(0.95) rotate(1deg)', opacity: '0.95' },
          '50%': { transform: 'scaleY(0.95) scaleX(1.05) rotate(-0.5deg)', opacity: '1' },
          '75%': { transform: 'scaleY(1.08) scaleX(0.92) rotate(1.5deg)', opacity: '0.9' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px oklch(0.65 0.22 290 / 0.3), 0 0 30px oklch(0.65 0.22 340 / 0.2)' },
          '50%': { boxShadow: '0 0 25px oklch(0.65 0.22 290 / 0.5), 0 0 50px oklch(0.65 0.22 340 / 0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        flicker: 'flicker 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
      },
    }
  },
  plugins: [typography, containerQueries, animate]
};
