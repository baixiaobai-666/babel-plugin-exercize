const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
const { transformFromAstSync  } = require('@babel/core');
const Linter = require('./babel-for-error');

const source = fs.readFileSync(path.join(__dirname, 'source.js'), {
    encoding: 'utf8'
})
const ast = parser.parse(source, {
    sourceType: 'unambiguous',
});
const { code } = transformFromAstSync (ast, source, {
    plugins: [Linter],
});

console.log(code);


