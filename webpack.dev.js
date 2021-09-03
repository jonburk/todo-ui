const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  externals: {
    'Config': JSON.stringify(require('./config/dev.json'))
  }
})