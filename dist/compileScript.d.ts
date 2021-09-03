import { SFCScriptBlock } from '@vue/compiler-sfc';
import { ScriptCompilerContext } from './types';
export declare const compileScript: (script: SFCScriptBlock | null, ctx: ScriptCompilerContext) => Promise<SFCScriptBlock | null>;
