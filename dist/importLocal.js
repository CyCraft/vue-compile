"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importLocal = void 0;
const resolve_from_1 = __importDefault(require("resolve-from"));
const importLocal = (dir, name, fallback) => {
    const found = resolve_from_1.default.silent(dir, name) ||
        (fallback && resolve_from_1.default.silent(dir, fallback));
    if (!found) {
        throw new Error(`You need to install "${name}"${fallback ? ` or "${fallback}"` : ''} in current directory!`);
    }
    return require(found);
};
exports.importLocal = importLocal;
