const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  externals: {
    'Config': JSON.stringify(require('./config/prod.json'))
  }
})