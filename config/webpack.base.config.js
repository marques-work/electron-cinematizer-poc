const path = require("path");
const os = require("os");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");

const ROOT = path.resolve(__dirname, "..");
const JS_FILE_PATTERN = /\.(js|jsx)$/;

module.exports = (child) => (env, argv) => {
  const production = argv.mode === "production";

  const base = {
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "..", "dist"),
    },

    devtool: production ? "source-map" : "eval-source-map",

    module: { rules: [eslintLoader(), babelLoader()] },

    resolve: {
      extensions: [".js", ".jsx"],
      modules: [path.resolve(ROOT, "src"), path.resolve(ROOT, "node_modules")],
    },

    optimization: {
      minimize: production,
      minimizer: [new TerserPlugin()],
    },
  };

  return merge(base, child(env, argv));
};

// private

function eslintLoader() {
  return {
    enforce: "pre",
    test: JS_FILE_PATTERN,
    exclude: /node_modules/,
    use: [{ loader: "eslint-loader", options: { cache: true, emitError: true, fix: true } }],
  };
}

function babelLoader() {
  return {
    test: JS_FILE_PATTERN,
    exclude: /node_modules/,
    use: [{
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins: ["@babel/plugin-proposal-class-properties"],
      },
    }],
  };
}
