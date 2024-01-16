const { declare } = require('@babel/helper-plugin-utils');
const doctrine = require('doctrine');
// const generate = require('@babel/generator').default;
const fse = require('fs-extra');
const renderer = require('./renderer');


function generate(docs, format = 'json') {
    if (format === 'markdown') {
        return {
            ext: '.md',
            content: renderer.markdown(docs)
        }
    } else if (format === 'html') {
        return {
            ext: 'html',
            content: renderer.html(docs)
        }
    } else {
        return {
            ext: 'json',
            content: renderer.json(docs)
        }        
    }
}
function parseComment(commentStr) {
    if (!commentStr) {
        return;
    }
    return doctrine.parse(commentStr, {
        unwrap: true
    });
}

function resolveType(tsType) {
    const typeAnnotation = tsType;
    if (!typeAnnotation) {
        return;
    }
    switch (typeAnnotation.type) {
        case 'TSStringKeyword': 
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSBooleanKeyword':
            return 'boolean';
    }
}

module.exports = declare((api, options) => {
    api.assertVersion(7);
    return {
        pre(file) {
            file.set('docs', []);
        },
        visitor: {
            FunctionDeclaration(path, state) {
                const docs = state.file.get('docs');
                const name = path.get('id').toString();
                const params =  path.get('params').map(paramPath=> {
                    return {
                        name: paramPath.toString(),
                        type: resolveType(paramPath.getTypeAnnotation())
                    }
                });
                const r = resolveType(path.get('returnType').getTypeAnnotation());
                const doc = path.node.leadingComments && parseComment(path.node.leadingComments[0].value)
                docs.push({
                    type: 'function',
                    name,
                    params,
                    return: r,
                    doc
                });
                state.file.set('docs', docs)
            },
            ClassDeclaration(path, state) {

            }
        },
        post(file) {
            const docs = file.get('docs');
            const res = generate(docs, options.format);
            fse.ensureDirSync(options.outputDir);
            fse.writeFileSync(path.join(options.outputDir, 'docs' + res.ext), res.content);
        }        
    };
})