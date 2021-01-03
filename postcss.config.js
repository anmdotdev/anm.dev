module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss',
    'postcss-flexbugs-fixes',
    ['postcss-preset-env', { stage: 2, browsers: '> 2%' }],
  ],
}
