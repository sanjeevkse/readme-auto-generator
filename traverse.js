const estraverse = require("estraverse");
let readMe = "";
function enter(node, parent) {
  readMe = "";
  if (node.type === "Program") {
    let functionDeclartionComments = node.comments[0].value.split("\n");
    let functionName,
      functionDescription,
      functionParams = [],
      functionReturns,
      functionThrows = [],
      functionExample = [];

    for (let i = 0; i < functionDeclartionComments.length; i++) {
      if (functionDeclartionComments[i].includes("@name")) {
        functionName = functionDeclartionComments[i].split("@name")[1].trim();
      } else if (functionDeclartionComments[i].includes("@description")) {
        functionDescription =
          functionDeclartionComments[i].split("@description")[1].trim() + "\n";
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
          paramObj.description = param.split("-")[1].trim();
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

    readMe += `## ${functionName}\n\n`;
    readMe += `${functionDescription}\n\n`;
    readMe += `### Parameters\n\n`;
    if (!!functionParams.length) {
      readMe += `| Name | Type & Default | Description |\n`;
      // readMe += `| ---- | -------------- | ----------- |\n`;
      for (let i = 0; i < functionParams.length; i++) {
        readMe += `| ${functionParams[i].name} | ${functionParams[i].type} | ${functionParams[i].description} |\n`;
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

function traverse(ast) {
  estraverse.traverse(ast, { enter });
  return readMe;
}

module.exports = traverse;
