const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const base = require("./webpack.base.config");

module.exports = base((env, argv) => ({
  entry: {
    control: "./src/views/control.jsx",
    renderer: "./src/views/renderer.js",
  },
  output: { path: path.resolve(__dirname, "..", "dist", "views") },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|dae|glb)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "images",
        },
      },
    ],
  },
  plugins: [
    page("Navigation", "control.html", { chunks: ["control"] }),
    page("Experience", "renderer.html", { chunks: ["renderer"] }),
    new ScriptExtHtmlWebpackPlugin({ defaultAttribute: "defer" }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  target: "electron-renderer",
}));

function page(title, file, opts = {}) {
  return new HtmlWebpackPlugin({
    title, template: `src/views/${file}`, filename: file, inject: "head", ...opts,
  });
}
