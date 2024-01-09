const parse = require("@babel/parser");
// 导出为 es module 导出，通过 commonjs 的方式引入的时候有时候需要取 default
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");

const sourceCode = `console.log(1);`;

const ast = parse(sourceCode, {
    sourceType: "unambiguous",
    plugins: ['jsx']
});

traverse(ast, {
    CallExpression(path) {
        if (types.isMemberExpression(path.node.callee)
            && path.node.callee.object.name === 'console' 
            && ['log', 'debugger', 'warn', 'error'].includes(path.node.callee.property.name)) {
                const { line, column } = path.node.loc.start;
                path.node.arguments.unshift(types.stringLiteral(`files：(${line}, ${column})`));
            }
    }
});

const { code, map } = generate(ast);
console.log(code);