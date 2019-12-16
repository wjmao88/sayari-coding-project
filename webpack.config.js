
const babelrc = require('./babelrc.js');

module.exports = {
  devtool: 'source-map',
  entry: __dirname + '/src/index',
  output: {
    path: __dirname + '/dist/assets/',
    publicPath: "/assets/",
    filename: "dist.js",
  },
  module: {
    rules: [{
      test: /\.(js|ts|tsx)$/,
      use: [{
        loader: 'babel-loader',
        options: babelrc
      }],
      exclude: /node_modules/,
    }, {
      test: /\.s[ac]ss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    }]
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    modules: [
      'src',
      'node_modules'
    ]   
  },
  devServer: {
    contentBase: __dirname + '/dist',
    compress: true,
    port: 12345,
    historyApiFallback: true,
    hot: true,
    watchOptions: {
      poll: 1000,
    }
  }
};