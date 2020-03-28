const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
//vue-server-renderer/client-plugin将文件编译成前端浏览器可运行的 vue-ssr-client-manifest.json 文件和 js、css 等文件
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const config = merge(base, {
  mode: 'development',
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {},
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]
})
module.exports = config
