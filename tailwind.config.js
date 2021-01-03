const defaultTheme = require('tailwindcss/defaultTheme')

const palette = {
  transparent: 'transparent',
  white: '#fff',

  black: '#222',
  'pure-black': '#000',

  link: '#3867d6',

  purple: {
    darker: '#4317c0',
    dark: '#5a27ed',
    DEFAULT: '#6a35ff',
    light: '#9672ff',
    lighter: '#cbb8ff',
    lightest: '#f3efff',
  },

  green: {
    darker: '#1e8a5e',
    dark: '#2db37c',
    DEFAULT: '#46d39a',
    light: '#7ee0b8',
    lighter: '#bef0dc',
    lightest: '#f0fbf7',
  },

  yellow: {
    darker: '#c96924',
    dark: '#e3833e',
    DEFAULT: '#ff9f59',
    light: '#ffbc8b',
    lighter: '#ffddc5',
    lightest: '#fff7f2',
  },

  red: {
    darker: '#c02634',
    dark: '#dc3544',
    DEFAULT: '#f14a59',
    light: '#f5808b',
    lighter: '#fac0c5',
    lightest: '#fef1f2',
  },

  gray: {
    darkest: '#444',
    darker: '#666',
    dark: '#777',
    DEFAULT: '#999',
    light: '#bbb',
    lighter: '#ddd',
    lightest: '#f6f7f8',
  },
}

module.exports = {
  purge:
    process.env.NODE_ENV === 'production'
      ? ['./packages/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}']
      : undefined,
  darkMode: 'class',
  theme: {
    colors: {
      purple: palette.purple,

      success: palette.green,
      warn: palette.yellow,
      error: palette.red,

      link: palette.link,
      gray: palette.gray,

      transparent: palette.transparent,

      white: palette.white,
      black: palette.black,
      'pure-black': palette['pure-black'],
    },
    boxShadow: (theme) => ({
      DEFAULT: '-4px 9px 25px -6px rgba(0, 0, 0, 0.1)',
      sm: 'rgba(188, 196, 218, 0.14) 14px 14px 55px 0px',
      lg: `8px 8px 20px 0px rgba(0, 0, 0, 0.1)`,
      right: '4px 9px 25px -6px rgba(0, 0, 0, 0.1) ',
      primary: `-4px 9px 25px -6px ${theme('colors.primary.lighter')}`,
      'lg-primary': `8px 8px 20px 0px ${theme('colors.primary.lighter')}`,
      error: `-4px 9px 25px -6px ${theme('colors.error.lighter')}`,
      'lg-error': `8px 8px 20px 0px ${theme('colors.error.lighter')}`,
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      outline: `0 0 0 3px ${theme('colors.primary.lighter')}`,
      focus: `0 0 0 3px ${theme('colors.primary.lighter')}`,
      none: 'none',
    }),
    screens: {
      xl: { max: '1280px' },
      lg: { max: '1024px' },
      md: { max: '768px' },
      sm: { max: '540px' },
    },
    extend: {
      fontFamily: {
        sans: ['Raleway', ...defaultTheme.fontFamily.sans],
      },
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
        4: '4 4 0%',
        5: '5 5 0%',
      },
    },
  },
  variants: {},
  plugins: [],
}
