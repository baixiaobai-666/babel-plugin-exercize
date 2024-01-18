const { transformFromAstAsync } = require('@babel/core');
const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
const Linter = require('./babel-eq-warn');

const source = `
    a == b
    foo == true
    bananas != 1
    value == undefined
    typeof foo == 'undefined'
    'hello' != 'world'
    0 == 0
    true == true
`;

const ast = parser.parse(source, {
    sourceType: 'unambiguous' 
});

const { code } = transformFromAstAsync(ast, source, {
    plugins: [[Linter, {
        fix: true
    }]],
    comments: true
});

console.log(code);
