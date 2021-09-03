'use strict'
const path = require('path')

module.exports = {  
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  entry: {
    bundle: ['@babel/polyfill', './src/index.jsx', './src/main.css', './src/index.html']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    assetModuleFilename: '[name][ext][query]'
  },
  module: {
    rules: [{
      test: /\.jsx?$/i,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    { 
      test: /\.html$/, 
      type: 'asset/resource'
    },
    { 
      test: /\.css$/, 
      type: 'asset/resource'
    },
    {
      test: /favicon\.ico$/,
      type: 'asset/resource'
    }]
  }
}
