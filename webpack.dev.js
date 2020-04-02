const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "static/js/[name].js?[hash]",
    pathinfo: true,
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        include: [path.resolve(__dirname, "./src")],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          compilerOptions: {
            whitespace: "condense"
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "vue-style-loader",
          },
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
            }
          },
        ],
      },
    ]
  },
  devServer: {
    inline: true,
    hot: true,
    host: "localhost",
    port: 8080,
    compress: false,
    clientLogLevel: "warning",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
});
