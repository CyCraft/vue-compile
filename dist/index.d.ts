/// <reference types="node" />
import { EventEmitter } from 'events';
declare type OptionContants = Record<string, string | boolean | number>;
interface InputOptions {
    config?: boolean | string;
    input: string;
    output: string;
    constants?: OptionContants;
    babelrc?: boolean;
    include?: string[];
    exclude?: string[];
    debug?: boolean;
    preserveTsBlock?: boolean;
}
interface NormalizedOptions {
    input: string;
    output: string;
    constants?: OptionContants;
    babelrc?: boolean;
    include?: string[];
    exclude?: string[];
    debug?: boolean;
    preserveTsBlock?: boolean;
}
declare class VueCompile extends EventEmitter {
    options: NormalizedOptions;
    isInputFile?: boolean;
    constructor(options: InputOptions);
    normalizeOptions(options: InputOptions): NormalizedOptions;
    normalize(): Promise<void>;
    normalizeFile(input: string, outFile: string): Promise<void>;
    normalizeDir(input: string, outDir: string): Promise<void>;
    writeText(source: string, { filename, outFile, babelrc, transformTypeScript, }: {
        filename: string;
        outFile: string;
        babelrc?: boolean;
        transformTypeScript: boolean;
    }): Promise<void>;
    writeBinary(source: Buffer, { filename, outFile }: {
        filename: string;
        outFile: string;
    }): Promise<void>;
}
export declare const createCompiler: (opts: InputOptions) => VueCompile;
export {};
