#!/usr/bin/env node
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
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
if (parseInt(process.versions.node, 10) < 8) {
    console.error(chalk_1.default.red('The "vue-compile" module requires Node.js 8 or above!'));
    console.error(chalk_1.default.dim(`Current version: ${process.versions.node}`));
    process.exit(1);
}
async function main() {
    const { cac } = await Promise.resolve().then(() => __importStar(require('cac')));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { version } = require('../package.json');
    const cli = cac('vue-compile');
    cli
        .command('[input]', 'Normalize input file or directory', {
        ignoreOptionDefaultValue: true,
    })
        .usage('[input] [options]')
        .action(async (input, flags) => {
        const options = {
            input,
            ...flags,
        };
        if (!options.input) {
            delete options.input;
        }
        if (options.debug === true) {
            process.env.DEBUG = 'vue-compile:*';
        }
        else if (typeof options.debug === 'string') {
            process.env.DEBUG = `vue-compile:${options.debug}`;
        }
        const { createCompiler } = await Promise.resolve().then(() => __importStar(require('.')));
        if (!options.input) {
            cli.outputHelp();
            return;
        }
        const compiler = createCompiler(options);
        compiler.on('normalized', async (input, output) => {
            if (!compiler.options.debug) {
                const { humanlizePath } = await Promise.resolve().then(() => __importStar(require('./utils')));
                console.log(`${chalk_1.default.magenta(humanlizePath(input))} ${chalk_1.default.dim('->')} ${chalk_1.default.green(humanlizePath(output))}`);
            }
        });
        await compiler.normalize().catch(handleError);
        if (flags.watch) {
            const { watch } = await Promise.resolve().then(() => __importStar(require('chokidar')));
            watch('.', {
                cwd: compiler.isInputFile
                    ? path_1.default.resolve(path_1.default.dirname(input))
                    : path_1.default.resolve(input),
                ignoreInitial: true,
                ignorePermissionErrors: true,
                ignored: '**/{node_modules,dist,.git,public}/**',
            }).on('all', (_, file) => {
                console.log(chalk_1.default.bold(`Rebuilding because ${file} changed..`));
                compiler.normalize().catch(handleError);
            });
        }
    })
        .option('-o, --output <file|directory>', 'Output path')
        .option('-i, --include <glob>', 'A glob pattern to include from input directory')
        .option('-e, --exclude <glob>', 'A glob pattern to exclude from input directory')
        .option('--no-babelrc', 'Disable .babelrc file')
        .option('--preserve-ts-block', `Preserve TypeScript types in script block`)
        .option('-w, --watch', 'Enable watch mode');
    cli.option('--debug', 'Show debug logs');
    cli.version(version);
    cli.help();
    cli.parse();
}
function handleError(error) {
    console.error(error.stack);
    process.exit(1);
}
main().catch(handleError);
