const fs = require("fs");
const path = require("path");
const estraverse = require("estraverse");
const readFiles = require("./readFiles");
const parseFile = require("./parseFile");
const traverse = require("./traverse");

let files = readFiles(__dirname + "/../src/");

files = files.filter((file) => {
  return file.includes("index.js");
});

// Parse each file and extract code snippets

const codeSnippets = files.flatMap((filePath) => parseFile(filePath));

// let readMe = codeSnippets.map((cs) => traverse(cs));

let readMeFunctions = "";
let readMe = "";

codeSnippets.map((cs) => {
  estraverse.traverse(cs, {
    enter(node, parent) {
      if (node.type === "Program") {
        console.log("node.comments", node.comments[0]);
        let functionDeclartionComments = node.comments[0].value.split("\n");
        let functionName,
          functionDescription,
          functionParams = [],
          functionReturns,
          functionThrows = [],
          functionExample = [];

        for (let i = 0; i < functionDeclartionComments.length; i++) {
          if (functionDeclartionComments[i].includes("@name")) {
            functionName = functionDeclartionComments[i]
              .split("@name")[1]
              .trim();
          } else if (functionDeclartionComments[i].includes("@description")) {
            functionDescription =
              functionDeclartionComments[i].split("@description")[1].trim() +
              "\n";
          } else if (functionDeclartionComments[i].includes("@param")) {
            let param = functionDeclartionComments[i].split("@param")[1].trim();
            let paramObj = {};
            if (param.split(" ")[1]) {
              paramObj.name = param.split(" ")[1].trim();
            }
            if (param.split(" ")[0]) {
              paramObj.type = param.split(" ")[0].trim();
            }
            if (param.split("-")[1]) {
              paramObj.default = param.split("-")[1].trim();
            }
            if (param.split("-")[2]) {
              paramObj.description = param.split("-")[2].trim();
            }
            functionParams.push(paramObj);
          } else if (functionDeclartionComments[i].includes("@returns")) {
            let returnValue = functionDeclartionComments[i]
              .split("@returns")[1]
              .trim();
            functionReturns = {
              type: returnValue.split(" ")[0].trim(),
              description: returnValue.split("-")[1].trim(),
            };
          } else if (functionDeclartionComments[i].includes("@throws")) {
            let throwsValue = functionDeclartionComments[i]
              .split("@throws")[1]
              .trim();
            let throwsObj = {};
            throwsObj = {
              type: throwsValue.split(" ")[0].trim(),
              description: throwsValue.split("-")[1].trim(),
            };
            functionThrows.push(throwsObj);
          } else if (functionDeclartionComments[i].includes("@example")) {
            functionExample.push(
              functionDeclartionComments[i].split("@example")[1].trim()
            );
          }
        }
        if (functionName) {
          readMeFunctions += `- [\`${functionName}()\`](#${functionName})\n`;
          readMe += `## ${functionName}\n\n`;
          readMe += `${functionDescription}\n\n`;
          readMe += `### Parameters\n\n`;
          if (!!functionParams.length) {
            readMe += `| Name | Type | Default | Description |\n`;
            readMe += `| ---- | ---- | ------- | ----------- |\n`;
            for (let i = 0; i < functionParams.length; i++) {
              readMe += `| ${functionParams[i].name} | ${functionParams[i].type} | ${functionParams[i].default} | ${functionParams[i].description} |\n`;
            }
          }
          readMe += `### Returns\n\n`;
          if (!!functionReturns) {
            readMe += `${functionReturns.type} - ${functionReturns.description} \n\n`;
          }
          readMe += `### Examples\n\n`;
          if (!!functionExample.length) {
            readMe += `\`\`\`js\n`;
            for (let i = 0; i < functionExample.length; i++) {
              readMe += `${functionExample[i]}\n`;
            }
            readMe += `\`\`\`\n\n`;
          }
        }
      }
    },
  });
});

// return false;

const readmeFile = fs.readFileSync(__dirname + "/../README.md", "utf8");
const readmeLines = readmeFile.split("\n");
const readmeStart = readmeLines.indexOf("[//]: START GENERATED CODE");
const readmeEnd = readmeLines.indexOf("[//]: END GENERATED CODE");

readmeLines.splice(
  readmeStart + 1,
  readmeEnd - readmeStart - 1,
  readMeFunctions + readMe
);
const newReadme = readmeLines.join("\n");

// const newReadme = readmeStartPart + readMe + readmeEndPart;

fs.writeFileSync(__dirname + "/../README.md", newReadme, "utf8");
