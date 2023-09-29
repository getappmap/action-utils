"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const node_fetch_1 = __importDefault(require("node-fetch"));
function downloadFile(url, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let readStream;
        if (url.protocol === 'file:') {
            readStream = (yield (0, promises_1.open)(url.pathname, 'r')).createReadStream();
        }
        else {
            const res = yield (0, node_fetch_1.default)(url);
            if (!res)
                throw new Error(`Could not download ${url}`);
            if (!res.body)
                throw new Error(`Response body for ${url} is empty`);
            if (res.status !== 200)
                throw new Error(`Could not download ${url}: ${res.statusText}`);
            readStream = res.body;
        }
        const writeStream = (0, fs_1.createWriteStream)(path);
        yield new Promise((resolve, reject) => {
            readStream.on('error', reject).pipe(writeStream).on('error', reject).on('finish', resolve);
        });
    });
}
exports.default = downloadFile;
