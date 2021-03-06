var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname, 'dist'),
    filename:'myCharts.js'
  },
  mode:'development',
  module:{
    rules:[
      {
        test:/\.js$/,
        exclude: /node_modules/,
        use:{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
    ]
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template:'./index.html',
  //     filename:path.resolve(__dirname, 'demo/index.html'),
  //   }),
  // ]
}