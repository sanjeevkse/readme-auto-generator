const fs = require("fs");
const esprima = require("esprima");

function parseFile(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const ast = esprima.parseScript(code, { range: true, comment: true });

  return ast;
}

module.exports = parseFile;
