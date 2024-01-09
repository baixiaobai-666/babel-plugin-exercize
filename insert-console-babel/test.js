const { transformFileSync } = require('@babel/core');
const insertParametersPlugin = require('./babel');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './source.js'), {
    plugins: [insertParametersPlugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx']       
    }
});

console.log(code);
