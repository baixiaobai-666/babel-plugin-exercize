const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const fs = require("fs");
const path = require("path");
const autoPoint = require("./index.js")

const sourceCode = fs.readFileSync(path.join(__dirname, "./source.js"), "utf-8");
const ast = parser.parse(sourceCode, { 
    sourceType: "unambiguous", // 或者 "script" 取决于你想要如何处理模块
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [autoPoint, {
        trackerPath: 'tracker'
    }]
});
console.log(code);