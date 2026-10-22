/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
        },
        card: {
          DEFAULT: "hsl(var(--card-background))",
          foreground: "hsl(var(--foreground))",
        },
        elevated: "hsl(var(--elevated-surface))",
        primary: {
          DEFAULT: "hsl(var(--primary-button))",
          foreground: "hsl(var(--primary-button-text))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary-button))",
          foreground: "hsl(var(--secondary-button-text))",
        },
        muted: {
          DEFAULT: "hsl(var(--elevated-surface))",
          foreground: "hsl(var(--muted-text))",
        },
        accent: {
          DEFAULT: "hsl(var(--hover-background))",
          foreground: "hsl(var(--foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--card-background))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Text colors
        "text-primary": "hsl(var(--foreground))",
        "text-secondary": "hsl(var(--secondary-text))",
        "text-muted": "hsl(var(--muted-text))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      transitionDuration: {
        '200': '200ms',
        '225': '225ms',
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
