// read key from object name is StatusCodesList in status-codes-list.constants.ts then generate exception-title-list.constants.ts
// Example:
// export const StatusCodesList = {
//   InternalServerError: 500,
// }
// To:
// Path: src/tools/gen-code-list.ts
// export const ExceptionTitleList = {
//   InternalServerError: 'Internal Server Error',
// }

import * as fs from "fs";
import { join } from "path";
import { stringify } from "querystring";
import { StatusCodesList } from "../common/constants/status-codes-list.constants";
// import { parse } from "comment-parser";

const srcPath = join(__dirname, "../");

const fromFile = "common/constants/status-codes-list.constants.ts";
const toFile = "common/constants/exception-title-list.constants.ts";

const codeList = {};

for (const key in StatusCodesList) {
  codeList[key] = key;
}

// codeList to string and write to file. Example: export const StatusCodesList = { InternalServerError: 'Internal Server Error', }
// Key is not string
let codeListString = `export const ExceptionTitleList = ${JSON.stringify(
  codeList,
  null,
  2,
)};`;

for (const key in codeList) {
  console.log("key", key);

  codeListString = codeListString.replace(`"${key}"`, key);
}

console.log(codeListString);

fs.writeFile(srcPath + toFile, codeListString, function (err) {
  if (err) throw err;
});
