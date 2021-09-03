"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const importLocal_1 = require("../importLocal");
const moduleRe = /^~([a-z0-9]|@).+/i;
const getUrlOfPartial = (url) => {
    const parsedUrl = path_1.default.parse(url);
    return `${parsedUrl.dir}${path_1.default.sep}_${parsedUrl.base}`;
};
const compile = async (code, { filename, indentedSyntax }) => {
    const sass = importLocal_1.importLocal(path_1.default.dirname(filename), 'sass', 'node-sass');
    const res = await util_1.promisify(sass.render.bind(sass))({
        file: filename,
        data: code,
        indentedSyntax,
        sourceMap: false,
        importer: [
            (url, importer, done) => {
                if (!moduleRe.test(url)) {
                    done({ file: url });
                    return;
                }
                const moduleUrl = url.slice(1);
                const partialUrl = getUrlOfPartial(moduleUrl);
                const options = {
                    basedir: path_1.default.dirname(importer),
                    extensions: ['.scss', '.sass', '.css'],
                };
                const finishImport = (id) => {
                    done({
                        // Do not add `.css` extension in order to inline the file
                        file: id.endsWith('.css') ? id.replace(/\.css$/, '') : id,
                    });
                };
                const next = () => {
                    // Catch all resolving errors, return the original file and pass responsibility back to other custom importers
                    done({ file: url });
                };
                const resolvePromise = util_1.promisify(require('resolve'));
                // Give precedence to importing a partial
                resolvePromise(partialUrl, options)
                    .then(finishImport)
                    .catch((error) => {
                    if (error.code === 'MODULE_NOT_FOUND' || error.code === 'ENOENT') {
                        resolvePromise(moduleUrl, options).then(finishImport).catch(next);
                    }
                    else {
                        next();
                    }
                });
            },
        ],
    });
    return res.css.toString();
};
exports.compile = compile;
