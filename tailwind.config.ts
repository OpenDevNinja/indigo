import type { Config } from "tailwindcss";
export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6',   // Light Blue
          DEFAULT: '#1E40AF', // Medium Blue
          dark: '#1E3A8A',    // Dark Blue
        },
        secondary: {
          light: '#7C3AED',   // Light Violet
          DEFAULT: '#6D28D9', // Medium Violet
          dark: '#5B21B6',    // Dark Violet
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      screens: {
        
        'xs': '475px',  // Extra small
        'sm': '640px',  // Small
        'md': '768px',  // Medium
        'lg': '1024px', // Large
        'xl': '1280px', // Extra large
        '2xl': '1536px' // 2X Extra large
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
} satisfies Config;