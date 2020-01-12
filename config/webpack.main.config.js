const path = require("path");
const CreateFileWebpack = require("create-file-webpack");
const base = require("./webpack.base.config");

module.exports = base((env, argv) => {
  const dir = path.resolve(__dirname, "..", "dist");
  const content = packageJsonContent();

  return {
    entry: {
      main: "./src/main.js",
    },
    plugins: [new CreateFileWebpack({ path: dir, fileName: "package.json", content })],
    target: "electron-main",
  };
});

function packageJsonContent() {
  const { version, description, repository, author, license } = require("../package.json");
  return JSON.stringify({ name: "cinematizer", main: "main.js", version, description, repository, author, license }, null, 2);
}
