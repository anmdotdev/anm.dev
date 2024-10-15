import { withPigment, extendTheme } from '@pigment-css/nextjs-plugin'

const palette = {
  transparent: 'transparent',
  white: '#fff',

  black: '#222',
  'pure-black': '#000',

  link: '#3867d6',

  airbase: '#ff6447',
  paylocity: '#fd6311',

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

// To learn more about theming, visit https://github.com/mui/pigment-css/blob/master/README.md#theming
const theme = extendTheme({
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

    airbase: palette.airbase,
    paylocity: palette.paylocity,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withPigment(nextConfig, { theme })
