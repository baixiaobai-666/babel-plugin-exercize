const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;
const sourceCode = `<div>{console.log(111)}</div>`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

traverse(ast, {
    CallExpression(path, state) {
        // 对于新节点需要打上标记，标记节点跳过处理
        if (path.node.isNew) {
            return; 
        }
        const callName = generate(path.node.callee).code;
        if (targetCalleeName.includes(callName)) {
            const { line, column } = path.node.loc.start;
            const newNode = template.expression(`console.log("file: ${line}, ${column}")`)()
            newNode.isNew = true;
            
            if (path.findParent(path => path.isJSXElement())) {
                path.replaceWith(types.arrayExpression([newNode, path.node]))
                path.skip();
            } else {
                path.insertBefore(newNode);
            }
        }
    }
})

const { code, map } = generate(ast);
console.log(code);