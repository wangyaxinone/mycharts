var base = require('./webpack.base');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path')
module.exports = merge(base,{
  entry:'./demo/index.js',
  output:{
    path:path.resolve(__dirname, 'dist'),
    filename:'[name].js'
  },
  devServer: {
    // contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true,
    hotOnly: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template:'./index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
})