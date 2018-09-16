var base = require('./webpack.base');
var merge = require('webpack-merge');
var CleanWebpackPlugin  = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = merge(base,{
  output:{
    library: 'myCharts',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  mode:"production",
 module:{
   rules:[
    {
      test:/\.css$/,
      use:[
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }
   ]
 },
  plugins:[
    new CleanWebpackPlugin('dist'),
    new MiniCssExtractPlugin({
        filename: "myCharts.css",
        //chunkFilename: "[id].[hash:6].css"
    }),
  ],
  optimization: {
    minimizer: [
        new UglifyJsPlugin({
          // cache: true,
          parallel: true,
          // sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
    ]
  },
})