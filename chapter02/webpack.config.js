const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "build"),
    publicPath: "/abc/",
    filename: "[name].[contenthash:8].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
      filename: "index.html"
    })
  ]
};
