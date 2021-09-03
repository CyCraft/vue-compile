"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileScript = void 0;
const utils_1 = require("./utils");
const compileScript = async (script, ctx) => {
    if (!script)
        return script;
    const code = script.content.replace(/^\/\/$/gm, '');
    if (!script.lang ||
        script.lang === 'esnext' ||
        script.lang === 'babel' ||
        script.lang === 'ts' ||
        script.lang === 'typescript') {
        script.content = await Promise.resolve().then(() => __importStar(require('./script-compilers/babel'))).then(async ({ compile }) => compile(code, ctx));
    }
    else {
        throw new Error(utils_1.notSupportedLang(script.lang, 'script'));
    }
    return script;
};
exports.compileScript = compileScript;
