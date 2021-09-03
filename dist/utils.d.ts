export declare const humanlizePath: (p: string) => string;
export declare const notSupportedLang: (lang: string, tag: string) => string;
export declare const replaceContants: (content: string, constants?: Record<string, any> | undefined) => string;
export declare const cssExtensionsRe: RegExp;
export declare const jsExtensionsRe: RegExp;
/**
 * Find babel config file in cwd
 * @param cwd
 * @param babelrc Whether to load babel config file
 */
export declare const getBabelConfigFile: (cwd: string, babelrc?: boolean | undefined) => string | undefined;
export declare function isDefined<T>(value: T | undefined | null): value is T;
