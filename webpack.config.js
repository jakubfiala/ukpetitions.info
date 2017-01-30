const webpack = require('webpack');

module.exports = {
  entry: ['babel-regenerator-runtime', './src/main.jsx'],
  output: {
    path: __dirname,
    filename: './dist/bundle.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['latest']
        }
      }
    ]
  }
}
