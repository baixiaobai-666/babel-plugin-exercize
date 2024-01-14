const { declare } = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');

// 第一点：引入 tracker 模块。如果已经引入过就不引入，没有的话就引入，并且生成个唯一 id 作为标识符
// 第二点：对所有函数在函数体开始插入 tracker 的代码
module.exports = declare((api, options, dirname) => {
    api.assertVersion(7);
    return  {
        visitor: {
            Program: {
                enter(...params) {
                    const [path, state] = params
                    path.traverse({
                        ImportDeclaration (curPath) {
                            const requirePath = curPath.get('source').node.value;
                            if (requirePath === options.trackerPath) {
                                const specifierPath = curPath.get('specifiers.0');
                                if (specifierPath.isImportSpecifier()) {
                                    state.trackerImportId = specifierPath.toString();
                                } else if(specifierPath.isImportNamespaceSpecifier()) {
                                    state.trackerImportId = specifierPath.get('local').toString();
                                }
                                path.stop();
                            }
                        }
                    });
                    if (!state?.trackerImportId) {
                        state.trackerImportId = importModule.addDefault(path, 'tracker', {
                            minHint: path.scope.generateUid('tracker')
                        }).name
                        state.trackerAst = api.template.statement(`${state.trackerImportId}()`)();
                    } 
                }
            },
            'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration': (path, state) => {
                const body = path.get('body')
                if (body && body?.isBlockStatement()) {
                    body.node.body?.unshift(state.trackerAst);
                } else {
                    const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({PREV_BODY: body.node});
                    body.replaceWith(ast);
                }
            }
        }
    }
});