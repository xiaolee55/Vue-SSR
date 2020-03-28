const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  context: path.resolve(__dirname, '../'),
  devtool: isProd ? 'source-map' : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    // ...
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      }
      // ...
    ]
  },
  plugins: [new VueLoaderPlugin()]
}
