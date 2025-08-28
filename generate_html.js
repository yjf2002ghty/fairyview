const fs = require("fs");

const HTML=fs.readFileSync("./src/index_head.html",{encoding:"utf8",flag:"r"});
const JS=fs.readFileSync("./public/bundle.js",{encoding:"utf8",flag:"r"});
fs.rmSync("./public/bundle.js",{force:true});

console.log(`${HTML}<body><script>${JS}</script></body>`);
