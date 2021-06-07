const util = require('util')
const glob = util.promisify(require('glob'))
const path = require('path')
const webpack = require('webpack')
const baseConfig = require('@instructure/ui-webpack-config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const mode = process.env.NODE_ENV || 'production'

const outputPath = path.resolve(__dirname, 'build')
const requires = ['instui-runtime-common', 'instui-vendors-common']
const bannerTemplate = `/**
 * @provides instui-[name]
 * @requires ${requires.join(' ')}
 */
`

const plugins = []
if (mode === 'production') {
  plugins.push(
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: (context) => {
        if (requires.includes(`instui-${context.chunk.name}`)) {
          return bannerTemplate.replace(` * @requires ${requires.join(' ')}\n`, '')
        }

        return bannerTemplate
      },
      raw: true,
    }),
  )
} else {
  plugins.push(
    new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
  )
}

module.exports = {
  ...baseConfig,
  entry: () => glob('./src/*/entry.js').then(matches => matches.reduce((entry, entryPath) => {
    const appName = entryPath.split('/')[2]
    const entryName = appName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    return { ...entry, [entryName]:entryPath }
  }, {})),
  optimization: {
    ...baseConfig.optimization,
    runtimeChunk: {
      name: 'runtime-common',
    },
    splitChunks: {
      ...baseConfig.optimization.splitChunks,
      name: 'vendors-common',
    },
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: mode !== 'production',
        terserOptions: {
          mangle: false,
          output: {
            semicolons: false,
            comments: /@provides/,
          },
        },
        extractComments: 'some',
      })
    ],
  },
  output: {
    path: outputPath,
    filename: '[name].js',
  },
  devServer: {
    disableHostCheck: true,
    contentBase: false,
    host: '0.0.0.0',
    hot: true,
  },
  node: {
    ...baseConfig.node,
    __filename: true,
  },
  plugins: [
    ...baseConfig.plugins,
    ...plugins,
  ],
}
