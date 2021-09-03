"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = (_, opts) => {
    const presets = [];
    if (opts.transformTypeScript) {
        presets.push(require.resolve('@babel/preset-typescript'));
    }
    presets.push([
        require.resolve('@babel/preset-env'),
        {
            modules: false,
            targets: {
                edge: '79',
                // Node 12 is no longer maintained, and let's pretend Node 13 didn't exist
                node: '14',
            },
        },
    ]);
    const plugins = [replaceExtensionInImports];
    if (!opts.transformTypeScript) {
        plugins.push(require('@babel/plugin-syntax-typescript'));
    }
    return {
        presets,
        plugins,
    };
};
function replaceExtensionInImports(opts) {
    const { types: t } = opts;
    return {
        name: 'replace-extension-in-imports',
        visitor: {
            ImportDeclaration(path) {
                if (utils_1.cssExtensionsRe.test(path.node.source.value)) {
                    path.node.source.value = path.node.source.value.replace(utils_1.cssExtensionsRe, '.css');
                }
            },
            CallExpression(path) {
                if (path.node.callee.name === 'require') {
                    const arg = path.get('arguments.0');
                    if (arg) {
                        const res = arg.evaluate();
                        if (res.confident && utils_1.cssExtensionsRe.test(res.value)) {
                            path.node.arguments = [
                                t.stringLiteral(res.value.replace(utils_1.cssExtensionsRe, '.css')),
                            ];
                        }
                    }
                }
            },
        },
    };
}
