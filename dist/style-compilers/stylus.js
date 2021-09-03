"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const importLocal_1 = require("../importLocal");
const compile = async (code, { filename }) => {
    const stylus = importLocal_1.importLocal(path_1.default.dirname(filename), 'stylus');
    return util_1.promisify(stylus.render.bind(stylus))(code, { filename });
};
exports.compile = compile;
