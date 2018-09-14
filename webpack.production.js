var base = require('./webpack.base');
var merge = require('webpack-merge');
var CleanWebpackPlugin  = require('clean-webpack-plugin');
module.exports = merge(base,{
  output:{
    library: 'myCharts',
    libraryTarget: 'umd',
  },
  plugins:[
    new CleanWebpackPlugin('dist')
  ],
  // optimization: {
  //   runtimeChunk: {
  //     name: 'manifest'
  //   },
  //   // minimizer: true, // [new UglifyJsPlugin({...})]
  //   splitChunks:{
  //     chunks: 'async',
  //     minSize: 30000,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     name: true,
  //     cacheGroups: {
  //       vendor: {
  //         name: 'vendor',
  //         chunks: 'initial',
  //         priority: -10,
  //         reuseExistingChunk: false,
  //         test: /node_modules\/(.*)\.js/
  //       },
  //       styles: {
  //         name: 'styles',
  //         test: /\.(scss|css)$/,
  //         chunks: 'all',
  //         minChunks: 1,
  //         reuseExistingChunk: true,
  //         enforce: true
  //       }
  //     }
  //   }
  // }
})