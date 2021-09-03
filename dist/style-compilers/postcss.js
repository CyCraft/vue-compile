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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('vue-compile:style');
const cache = new Map();
const compile = async (code, { filename }) => {
    const ctx = {
        file: {
            extname: path_1.default.extname(filename),
            dirname: path_1.default.dirname(filename),
            basename: path_1.default.basename(filename)
        },
        options: {}
    };
    const cwd = path_1.default.dirname(filename);
    const config = cache.get(cwd) ||
        (await require('postcss-load-config')(ctx, cwd, {
            argv: false
        }).catch((error) => {
            if (error.message.includes('No PostCSS Config found in')) {
                return {};
            }
            throw error;
        }));
    cache.set(cwd, config);
    if (config.file) {
        debug(`Using PostCSS config file at ${config.file}`);
    }
    const options = {
        from: filename,
        map: false,
        ...config.options
    };
    return Promise.resolve().then(() => __importStar(require('postcss'))).then(async (postcss) => {
        return postcss
            .default(config.plugins || [])
            .process(code, options)
            .then(res => res.css);
    });
};
exports.compile = compile;
