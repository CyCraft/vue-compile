import { PluginObj, types as Types } from '@babel/core';
declare const _default: (_: any, opts: {
    transformTypeScript: boolean;
}) => {
    presets: (string | (string | {
        modules: boolean;
        targets: {
            edge: string;
            node: string;
        };
    })[])[];
    plugins: (typeof replaceExtensionInImports)[];
};
export default _default;
declare function replaceExtensionInImports(opts: {
    types: typeof Types;
}): PluginObj;
