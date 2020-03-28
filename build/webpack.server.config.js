// 通过 target: 'node' 告诉 webpack 编译的目录代码是 node 应用程序
// 通过 VueSSRServerPlugin 插件，将代码编译成 vue-ssr-server-bundle.json

const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals') // Webpack allows you to define externals - modules that should not be bundled.
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(base, {
  mode: 'production',
  target: 'node',
  devtool: '#source-map',
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {},
  externals: nodeExternals({
    whitelist: /\.css$/ // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ]
})

