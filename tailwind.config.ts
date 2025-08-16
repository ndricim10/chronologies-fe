/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(240, 10%, 3.9%)',
        card: 'hsl(0, 0%, 100%)',
        'card-foreground': 'hsl(240, 10%, 3.9%)',
        popover: 'hsl(0, 0%, 100%)',
        'popover-foreground': 'hsl(240, 10%, 3.9%)',
        primary: '#003666',
        'table-header': '#fbf8f8',
        'primary-foreground': 'hsl(0, 0%, 98%)',
        secondary: '#ff731d',
        'secondary-foreground': 'hsl(240, 5.9%, 10%)',
        muted: 'hsl(240, 4.8%, 95.9%)',
        'muted-foreground': 'hsl(240, 3.8%, 46.1%)',
        accent: 'hsl(240, 4.8%, 95.9%)',
        'accent-foreground': 'hsl(240, 5.9%, 10%)',
        destructive: 'hsl(0, 84.2%, 60.2%)',
        'destructive-foreground': 'hsl(0, 0%, 98%)',
        border: 'hsl(240, 5.9%, 90%)',
        input: 'hsl(240, 5.9%, 90%)',
        ring: 'hsl(240, 5.9%, 10%)',
        radius: '0.5rem',
        warning: 'hsl(48, 96%, 89%)',
        'warning-foreground': 'hsl(38, 92%, 50%)',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
