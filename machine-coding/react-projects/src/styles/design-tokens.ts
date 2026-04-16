/**
 * DESIGN TOKENS (Source of Truth)
 * 
 * This file contains all the design primitives and semantic mappings for the project.
 * It is consumed by:
 * 1. theme.css (to generate CSS variables)
 * 2. Component logic (where raw values are needed for JS/Canvas)
 */

export const primitives = {
  colors: {
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    brand: {
      50: 'oklch(0.97 0.01 250)',
      100: 'oklch(0.92 0.03 250)',
      200: 'oklch(0.85 0.08 250)',
      300: 'oklch(0.75 0.15 250)',
      400: 'oklch(0.65 0.22 250)',
      500: 'oklch(0.55 0.25 250)',
      600: 'oklch(0.48 0.23 250)',
      700: 'oklch(0.40 0.20 250)',
      800: 'oklch(0.32 0.17 250)',
      900: 'oklch(0.25 0.14 250)',
    },
    success: {
      500: 'oklch(0.65 0.2 150)',
    },
    error: {
      500: 'oklch(0.6 0.2 25)',
    },
    warning: {
      500: 'oklch(0.8 0.15 85)',
    }
  },
  typography: {
    tiny: '0.625rem', // 10px
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  shadows: {
    soft: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    hard: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  }
};

export const semantic = {
  light: {
    bg: {
      canvas: primitives.colors.slate[50], // Background of the app
      surface: '#ffffff', // Cards, modals
      muted: primitives.colors.slate[100],
    },
    text: {
      main: primitives.colors.slate[900],
      muted: primitives.colors.slate[500],
      inverted: '#ffffff',
    },
    border: {
      subtle: primitives.colors.slate[200],
      strong: primitives.colors.slate[300],
    }
  },
  dark: {
    bg: {
      canvas: primitives.colors.slate[950],
      surface: primitives.colors.slate[900],
      muted: primitives.colors.slate[800],
    },
    text: {
      main: primitives.colors.slate[50],
      muted: primitives.colors.slate[400],
      inverted: primitives.colors.slate[950],
    },
    border: {
      subtle: primitives.colors.slate[800],
      strong: primitives.colors.slate[700],
    }
  }
};
