const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const base = require("./webpack.base.config");

module.exports = base((env, argv) => ({
  entry: {
    control: "./src/views/control.jsx",
  },
  output: { path: path.resolve(__dirname, "..", "dist", "views") },
  plugins: [
    page("Navigation", "control.html", { chunks: ["control"] }),
    page("Experience", "renderer.html", { chunks: [] }),
  ],
  target: "electron-renderer",
}));

function page(title, file, opts = {}) {
  return new HtmlWebpackPlugin({
    title, template: `src/views/${file}`, filename: file, inject: "head", ...opts,
  });
}
