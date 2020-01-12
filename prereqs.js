const semver = require("semver");
const version = (require("./package.json").engines || {}).node;

if (!semver.satisfies(process.version, version)) {
  console.error(`\n\n**** This application requires node version ${version}; you are running ${process.version}. ****\n\n`);
  process.exit(1);
}
