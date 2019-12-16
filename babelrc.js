
module.exports = {
  presets: [
    ['@babel/preset-env', { modules: 'commonjs' }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-transform-runtime'
  ]
}