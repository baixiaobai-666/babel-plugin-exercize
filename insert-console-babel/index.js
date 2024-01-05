const parse = require("@babel/parser");
// 导出为 es module 导出的时候，通过 commonjs 的方式引入的时候有时候需要取 default
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const sourceCode = `console.log(1);`;

const ast = parse(sourceCode, {
    sourceType: "unambiguous",
});

traverse(ast, {
    CallExpression(path) {
        
    }
});