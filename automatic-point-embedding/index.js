const parser = require('@babel/parser');
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const importModule = require('@babel/helper-module-imports');

const sourceCode = `
import aa from 'aa';
import * as bb from 'bb';
import { cc } from 'cc';
import 'dd';

function a() {
    _tracker2();

    console.log('aaa');
}

class B {
    bb() {
        _tracker2();

        return 'bbb';
    }

}

const c = () => {
    _tracker2();

    return 'ccc';
};

const d = function () {
    _tracker2();

    console.log('ddd');
};
`;
// 第一点：引入 tracker 模块。如果已经引入过就不引入，没有的话就引入，并且生成个唯一 id 作为标识符
// 第二点：对所有函数在函数体开始插入 tracker 的代码
const ast = parser.parse(sourceCode, { sourceType: 'unambiguous' });
traverse(ast, {
    Program: {
        enter(path, state) {
            path.traverse({
                ImportDeclaration(curPath) {
                    const requirePath = curPath.get('source').node.value
                    if (requirePath === 'tracker') {
                        const specifiersPath = curPath.get('specifiers.0')
                        if (specifiersPath.isImportDeclaration()) {
                            state.trackerImportId = requirePath.toString();    
                        } else if (specifiersPath.isImportNamespaceSpecifier()) {
                            state.trackerImportId = specifierPath.get('local').toString();
                        }
                        path.stop();
                    }
                }
            });
            if (!state.trackerImportId) {
                importModule.addDefault(path, 'tracker', {
                    minHint: path.scope.generateUid('tracker')
                })
            } 
        }
    }
});
const { code, map } = generator(ast)
console.log(code);