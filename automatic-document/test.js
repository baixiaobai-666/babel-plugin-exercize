const { transformFromAstSync } = require("@babel/core");
const parser = require("@babel/parser");
const fs = require("fs");
const path = require("path");
const autoDocumentPlugin = require("./index.js");

const source = fs.readFileSync(path.join(__dirname, "./source.ts"), {
    encoding: "utf-8"
});

const ast = parser.parse(source, {
    sourceType: "unambiguous",
    plugins: ["typescript"],
});

const { code } = transformFromAstSync(ast, source, {
    plugins: [[autoDocumentPlugin, {
        outputDir: path.resolve(__dirname, './docs'),
        format: 'markdown'// html / json
    }]]
});
console.log(code);