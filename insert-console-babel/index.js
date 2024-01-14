const parser = require("@babel/parser");
// 导出为 es module 导出，通过 commonjs 的方式引入的时候有时候需要取 default
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");

const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser.parse(sourceCode, {
    sourceType: "unambiguous",
    plugins: ['jsx']
});

traverse(ast, {
    CallExpression(path) {
        if (types.isMemberExpression(path.node.callee)
            && path.node.callee.object.name === 'console' 
            && ['log', 'debug', 'warn', 'error', 'info'].includes(path.node.callee.property.name)) {
                const { line, column } = path.node.loc.start;
                path.node.arguments.unshift(types.stringLiteral(`files:(${line}, ${column})`));
            }
    }
});

const { code, map } = generator(ast);
console.log(code);