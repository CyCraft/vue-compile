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
exports.createCompiler = void 0;
const path_1 = __importDefault(require("path"));
const events_1 = require("events");
const fs_extra_1 = __importDefault(require("fs-extra"));
const joycon_1 = __importDefault(require("joycon"));
const is_binary_path_1 = __importDefault(require("is-binary-path"));
const debug_1 = __importDefault(require("debug"));
const compiler_sfc_1 = require("@vue/compiler-sfc");
const fast_glob_1 = __importDefault(require("fast-glob"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const utils_1 = require("./utils");
const compileScript_1 = require("./compileScript");
// import { compileStyles } from './compileStyles'
const compileTemplate_1 = require("./compileTemplate");
const writeSFC_1 = require("./writeSFC");
const debug = debug_1.default('vue-compile:cli');
class VueCompile extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (options.config !== false) {
            const joycon = new joycon_1.default({
                files: [
                    typeof options.config === 'string'
                        ? options.config
                        : 'vue-compile.config.js',
                ],
                stopDir: path_1.default.dirname(process.cwd()),
            });
            const { data: config, path: configPath } = joycon.loadSync();
            if (configPath) {
                debug(`Using config file: ${configPath}`);
            }
            options = { ...options, ...config };
        }
        this.options = this.normalizeOptions(options);
        this.isInputFile = fs_extra_1.default.statSync(this.options.input).isFile();
    }
    normalizeOptions(options) {
        return {
            ...options,
            input: path_1.default.resolve(options.input),
            output: path_1.default.resolve(options.output),
        };
    }
    async normalize() {
        if (!this.options.input) {
            return;
        }
        if (this.isInputFile) {
            if (!this.options.output) {
                throw new Error('You must specify the path to output file.');
            }
            await this.normalizeFile(this.options.input, this.options.output);
        }
        else {
            if (!this.options.output) {
                throw new Error('You must specify the path to output directory.');
            }
            await this.normalizeDir(this.options.input, this.options.output);
        }
    }
    async normalizeFile(input, outFile) {
        if (is_binary_path_1.default(input)) {
            const buffer = await fs_extra_1.default.readFile(input);
            return this.writeBinary(buffer, {
                filename: input,
                outFile,
            });
        }
        let source = await fs_extra_1.default.readFile(input, 'utf8');
        source = utils_1.replaceContants(source, this.options.constants);
        const ctx = {
            filename: input,
            outFile,
            babelrc: this.options.babelrc,
            transformTypeScript: true,
        };
        if (!input.endsWith('.vue')) {
            return this.writeText(source, ctx);
        }
        ctx.transformTypeScript = !this.options.preserveTsBlock;
        const sfc = lodash_clonedeep_1.default(compiler_sfc_1.parse(source, {
            filename: input,
        }));
        const script = await compileScript_1.compileScript(sfc.descriptor.script, ctx);
        const scriptSetup = await compileScript_1.compileScript(sfc.descriptor.scriptSetup, ctx);
        const template = compileTemplate_1.compileTemplate(sfc.descriptor.template);
        const styles = sfc.descriptor.styles;
        await writeSFC_1.writeSFC({
            scripts: [script, scriptSetup].filter(utils_1.isDefined).sort((a, b) => {
                return a.loc.start > b.loc.start ? -1 : 1;
            }),
            styles,
            template,
            customBlocks: sfc.descriptor.customBlocks,
            preserveTsBlock: this.options.preserveTsBlock,
        }, outFile);
        this.emit('normalized', input, outFile);
    }
    async normalizeDir(input, outDir) {
        var _a, _b;
        const include = [...((_a = this.options.include) !== null && _a !== void 0 ? _a : [])];
        const exclude = [...((_b = this.options.exclude) !== null && _b !== void 0 ? _b : [])];
        const files = await fast_glob_1.default(include.length > 0 ? include : ['**/*'], {
            cwd: input,
            ignore: ['**/node_modules/**'].concat(exclude),
        });
        await Promise.all(files.map(async (file) => {
            return this.normalizeFile(path_1.default.join(input, file), path_1.default.join(outDir, file));
        }));
    }
    async writeText(source, { filename, outFile, babelrc, transformTypeScript, }) {
        let output;
        if (utils_1.jsExtensionsRe.test(filename)) {
            output = await Promise.resolve().then(() => __importStar(require('./script-compilers/babel'))).then(async ({ compile }) => {
                return compile(source, {
                    filename,
                    babelrc,
                    transformTypeScript,
                });
            });
        }
        else if (filename.endsWith('.css')) {
            output = await Promise.resolve().then(() => __importStar(require('./style-compilers/postcss'))).then(async ({ compile }) => {
                return compile(source, { filename });
            });
        }
        else if (/\.s[ac]ss$/.test(filename)) {
            const basename = path_1.default.basename(filename);
            if (basename.startsWith('_')) {
                // Ignore sass partial files
                return;
            }
            output = await Promise.resolve().then(() => __importStar(require('./style-compilers/sass'))).then(async ({ compile }) => {
                return compile(source, {
                    filename,
                    indentedSyntax: filename.endsWith('.sass'),
                });
            });
        }
        else if (/\.styl(us)?/.test(filename)) {
            output = await Promise.resolve().then(() => __importStar(require('./style-compilers/stylus'))).then(async ({ compile }) => {
                return compile(source, {
                    filename,
                });
            });
        }
        else {
            output = source;
        }
        outFile = outFile.replace(utils_1.cssExtensionsRe, '.css');
        outFile = outFile.replace(utils_1.jsExtensionsRe, '.js');
        await fs_extra_1.default.outputFile(outFile, output, 'utf8');
        this.emit('normalized', filename, outFile);
    }
    async writeBinary(source, { filename, outFile }) {
        await fs_extra_1.default.outputFile(outFile, source, 'utf8');
        this.emit('normalized', filename, outFile);
    }
}
const createCompiler = (opts) => new VueCompile(opts);
exports.createCompiler = createCompiler;
