var path = require("path");

const config = {
  folderPath: path.join(__dirname, "..", "examples"),
  exclude: [],
  include: ["index.js"],
  outputFile: path.join(__dirname, "..", "GENERATED_README.md"),
};

module.exports = config;
