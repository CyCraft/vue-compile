"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const preset_1 = __importDefault(require("../babel/preset"));
const utils_1 = require("../utils");
const debug = debug_1.default('vue-compile:script');
const compile = async (code, { filename, babelrc, transformTypeScript }) => {
    const cwd = path_1.default.dirname(filename);
    const babelConfigFile = utils_1.getBabelConfigFile(cwd, babelrc);
    const config = {
        filename,
        presets: [[preset_1.default, { transformTypeScript }]],
    };
    if (babelConfigFile) {
        config.babelrc = true;
        debug(`Using Babel config file at ${babelConfigFile}`);
    }
    else {
        config.babelrc = false;
    }
    return require('@babel/core').transform(code, config).code;
};
exports.compile = compile;
