const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const fs = require('fs')
const path = require('path')

const noop = () => {}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: {
      bundle: path.resolve(__dirname, 'src', 'index.ts'),
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, isProduction ? 'dist' : 'dev'),
      filename: `[name].min.js${isProduction ? '?[contenthash]' : ''}`,
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: 200000,
        cacheGroups: {
          defaultVendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 5,
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      isProduction ? new CleanWebpackPlugin() : noop,
      isProduction
        ? new CopyPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, 'assets'),
                to: path.resolve(__dirname, 'dist', 'assets'),
              },
            ],
          })
        : noop,
      new MiniCssExtractPlugin({
        filename: `[name].min.css${isProduction ? '?[contenthash]' : ''}`,
      }),
      new HtmlWebpackPlugin({
        minify: false,
        template: path.resolve(__dirname, 'src', 'index.html'),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css|s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                sassOptions: {
                  outputStyle: 'compressed',
                },
              },
            },
          ],
        },
        {
          test: /\.[tj]s$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-proposal-class-properties'],
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
      ],
    },
    devtool: !isProduction && 'inline-source-map',
    devServer: {
      writeToDisk: false,
      contentBase: path.join(__dirname),
      compress: true,
      port: 3000,
      host: '0.0.0.0',
      overlay: true,
      https: false
    },
  }
}
