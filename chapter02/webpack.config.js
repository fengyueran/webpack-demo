const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    publicPath: "/",
    filename: "[name].[contenthash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        //To be safe, you can use enforce: 'pre' section to check source files, not modified by other loaders (like babel-loader):
        enforce: "pre",
        use: [
          {
            loader: "eslint-loader",
            options: {
              cache: true,
              fix: true, //自动修复
              //当指定formatter时，eslintPath需要指定
              eslintPath: require.resolve("eslint"),
              //使输出信息更加友好
              formatter: require.resolve("react-dev-utils/eslintFormatter"),
              resolvePluginsRelativeTo: __dirname
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
      filename: "index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    // 提取css到一个文件
    isEnvProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
      })
  ].filter(Boolean)
};
