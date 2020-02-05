'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

const config = {
  mode: 'development',
  devtool: 'sourcemap',
  output: {
    filename: '[name].[hash].js',
  },
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
          MiniCssExtractPlugin.loader,
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
        test: [/\.mp3$/, /\.png$/, /\.ico$/],
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./src/index.template.html'),
    }),
    new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
    new CleanWebpackPlugin(),
    new EnvironmentPlugin({
      SAMPLE_FILE_HOST: '//localhost:6969',
    }),
  ],
};

module.exports = config;
