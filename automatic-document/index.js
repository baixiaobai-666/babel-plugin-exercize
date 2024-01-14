const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
    api.assertVersion(7);
    return {
        pre() {

        },
        visitor: {
            FunctionDeclaration(path, state) {
                
            },
            ClassDeclaration(path, state) {

            }
        },
        post() {

        }
    };
})