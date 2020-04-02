const path = require("path")
const webpack = require("webpack")
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {
  entry: "./src/main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader?cacheDirectory",
        include: [path.resolve(__dirname, "./src")],
      },
      {
        test: /\.styl(us)?$/,
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
          {
            loader: "stylus-loader",
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "static/img/[name].[hash].[ext]",
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "static/fonts/[name].[hash].[ext]",
              esModule: false,
            },
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    modules: [path.resolve(__dirname, "./src"), "node_modules"],
    mainFields: ["browser", "module", "main"],
    plugins: [new DirectoryNamedWebpackPlugin()],
    alias: {
      "vue$": "vue/dist/vue.runtime.esm.js",
      "@": path.resolve(__dirname, "./src"),
    }
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
      title: "maze",
      favicon: "favicon.png",
      chunksSortMode: "dependency",
    }),
    new InlineManifestWebpackPlugin(),
    new VueLoaderPlugin(),
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      // include all types of chunks
      chunks: "all"
    }
  },
}
