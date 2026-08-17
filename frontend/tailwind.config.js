/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgBase: 'hsl(var(--bg-base) / <alpha-value>)',
        bgSurface: 'hsl(var(--bg-surface) / <alpha-value>)',
        bgSurfaceElevated: 'hsl(var(--bg-surface-elevated) / <alpha-value>)',
        bgSurfaceHover: 'hsl(var(--bg-surface-hover) / <alpha-value>)',
        borderColor: 'hsl(var(--border-color) / <alpha-value>)',
        borderGlow: 'hsl(var(--border-glow) / <alpha-value>)',
        textPrimary: 'hsl(var(--text-primary) / <alpha-value>)',
        textSecondary: 'hsl(var(--text-secondary) / <alpha-value>)',
        textMuted: 'hsl(var(--text-muted) / <alpha-value>)',
        primary: 'hsl(var(--primary) / <alpha-value>)',
        primaryHover: 'hsl(var(--primary-hover) / <alpha-value>)',
        accentPurple: 'hsl(var(--accent-purple) / <alpha-value>)',
        accentPurpleHover: 'hsl(var(--accent-purple-hover) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
