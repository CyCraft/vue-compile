import { SFCScriptBlock, SFCStyleBlock, SFCTemplateBlock, SFCBlock } from '@vue/compiler-sfc';
export declare const writeSFC: ({ scripts, styles, template, customBlocks, preserveTsBlock, }: {
    scripts: SFCScriptBlock[];
    styles: SFCStyleBlock[];
    template: SFCTemplateBlock | null;
    customBlocks: SFCBlock[];
    preserveTsBlock?: boolean | undefined;
}, outFile: string) => Promise<void>;
