'use strict'
const path = require('path')
const webpack = require('webpack')
const BUILD = process.env.ENV_TYPE === 'production'

module.exports = {
  mode: process.env.ENV_TYPE || 'development',
  devtool: BUILD ? 'source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  entry: {
    bundle: ['@babel/polyfill', './src/index.jsx', './src/main.css', './src/index.html']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
      test: /\.jsx?$/i,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
      { test: /\.html$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.css$/, loader: 'file-loader?name=[name].[ext]' },
    {
      test: /favicon\.ico$/,
      loader: 'url-loader',
      query: {
        limit: 1,
        name: '[name].[ext]'
      }
    }]
  },
  externals: {
    'Config': JSON.stringify(BUILD ? require('./config/prod.json') : require('./config/dev.json'))
  }
}
