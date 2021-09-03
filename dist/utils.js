"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = exports.getBabelConfigFile = exports.jsExtensionsRe = exports.cssExtensionsRe = exports.replaceContants = exports.notSupportedLang = exports.humanlizePath = void 0;
const path_1 = __importDefault(require("path"));
const core_1 = require("@babel/core");
const humanlizePath = (p) => path_1.default.relative(process.cwd(), p);
exports.humanlizePath = humanlizePath;
const notSupportedLang = (lang, tag) => {
    return `"${lang}" is not supported for <${tag}> tag currently, wanna contribute this feature?`;
};
exports.notSupportedLang = notSupportedLang;
function escapeRe(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}
const replaceContants = (content, constants) => {
    if (!constants)
        return content;
    const RE = new RegExp(`\\b(${Object.keys(constants).map(escapeRe).join('|')})\\b`, 'g');
    content = content.replace(RE, (_, p1) => {
        return constants[p1];
    });
    return content;
};
exports.replaceContants = replaceContants;
exports.cssExtensionsRe = /\.(css|s[ac]ss|styl(us)?)$/;
exports.jsExtensionsRe = /\.[jt]sx?$/;
const babelConfigCache = new Map();
/**
 * Find babel config file in cwd
 * @param cwd
 * @param babelrc Whether to load babel config file
 */
const getBabelConfigFile = (cwd, babelrc) => {
    var _a, _b;
    const file = babelrc === false
        ? undefined
        : (_a = babelConfigCache.get(cwd)) !== null && _a !== void 0 ? _a : (_b = core_1.loadPartialConfig()) === null || _b === void 0 ? void 0 : _b.babelrc;
    babelConfigCache.set(cwd, file);
    return file;
};
exports.getBabelConfigFile = getBabelConfigFile;
function isDefined(value) {
    return value != null;
}
exports.isDefined = isDefined;
