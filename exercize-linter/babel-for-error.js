const { declare } = require('@babel/helper-plugin-utils');

const forDirectionLint = declare((api, options, dirname) => {
    api.assertVersion(7);

    return {
        pre(file) {
            file.set('errors', []);
        },
        visitor: {
            ForStatement(path, state) {
                const errors = state.file.get('errors');
                const tesOperator = path.node.test.operator;
                const updateOperator = path.node.update.operator;
                let tag;
                if (['>', '>='].includes(tesOperator)) {
                    tag = '--';
                } else if (['<', '<='].includes(tesOperator)) {
                    tag = '++'
                }
                if (updateOperator !== tag) {
            
                    // 报错我们使用 path 的 buildCodeFrameError 方法，他会构造一个 code frame，标记出当前 node 的位置。
                    //（第一个参数是错误信息，第二个参数是 Error 对象）
                    // 但是这个报错信息不是很明显
                    // throw path.get('update').buildCodeFrameError("for direction error", Error)

                    const e = Error.stackTraceLimit;
                    // 设置 Error.stackTraceLimit 为 0 ，这样可以去掉 stack 的信息
                    Error.stackTraceLimit = 0;
                    errors.push(path.get('update').buildCodeFrameError('错误：', Error));
                    Error.stackTraceLimit = e;
                }
                state.file.set('errors', errors);
            }
        },
        post(file) {
            console.log(file.get('errors'));
        }
    }
});

module.exports = forDirectionLint;