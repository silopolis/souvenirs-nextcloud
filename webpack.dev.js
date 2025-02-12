const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
var openInEditor = require('launch-editor-middleware');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    overlay: true,
    before (app) {
      app.use('/__open-in-editor', openInEditor('code'))
    },
  },
  devtool: 'source-map',
  plugins: [new BundleAnalyzerPlugin()]
})