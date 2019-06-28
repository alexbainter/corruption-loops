'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  mode: 'development',
  devtool: 'sourcemap',
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        include: /src/,
        use: 'babel-loader',
      },
      {
        test: /\.worker\.js/,
        include: /src/,
        use: 'worker-loader',
      },
      {
        test: [/\.css$/, /\.scss$/],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./src/styles'],
            },
          },
        ],
      },
      {
        test: /\.mp3$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./src/index.template.html'),
    }),
  ],
};

module.exports = config;
