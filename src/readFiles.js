const fs = require("fs");

function readFiles(dir) {
  const files = fs.readdirSync(dir);

  return files.flatMap((file) => {
    let filePath = `${dir}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      return readFiles(filePath);
    } else {
      return [filePath];
    }
  });
}

module.exports = readFiles;
