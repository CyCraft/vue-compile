"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSFC = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const stringify_attributes_1 = __importDefault(require("stringify-attributes"));
const utils_1 = require("./utils");
const writeSFC = async ({ scripts, styles, template, customBlocks, preserveTsBlock, }, outFile) => {
    const parts = [];
    if (template) {
        parts.push(`<template${stringify_attributes_1.default(template.attrs)}>${template.content
            .replace(/\n$/, '')
            .replace(/^/gm, '  ')}\n</template>`);
    }
    scripts.forEach((script) => {
        parts.push(`<script${preserveTsBlock && script.lang === 'ts' ? ' lang="ts"' : ''}${script.setup ? ' setup' : ''}>\n${script.content.trim()}\n</script>`);
    });
    if (styles.length > 0) {
        for (const style of styles) {
            const attrs = { ...style.attrs };
            delete attrs.lang;
            if (style.src) {
                attrs.src = style.src.replace(utils_1.cssExtensionsRe, '.css');
                parts.push(`<style${stringify_attributes_1.default(attrs)}></style>`);
            }
            else {
                parts.push(`<style lang="sass"${stringify_attributes_1.default(attrs)}>\n${style.content.trim()}\n</style>`);
            }
        }
    }
    if (customBlocks) {
        for (const block of customBlocks) {
            parts.push(`<${block.type}${stringify_attributes_1.default(block.attrs)}>${block.content ? block.content.trim() : ''}</${block.type}>`);
        }
    }
    await fs_extra_1.default.ensureDir(path_1.default.dirname(outFile));
    await fs_extra_1.default.writeFile(outFile, parts.join('\n\n'), 'utf8');
};
exports.writeSFC = writeSFC;
