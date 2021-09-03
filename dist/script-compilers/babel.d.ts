import { ScriptCompilerContext } from '../types';
export declare const compile: (code: string, { filename, babelrc, transformTypeScript }: ScriptCompilerContext) => Promise<string>;
