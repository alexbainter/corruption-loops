const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // {
      //   test: [/\.css$/, /\.scss$/],
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //         includePaths: ['./src/styles'],
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};

module.exports = config;
