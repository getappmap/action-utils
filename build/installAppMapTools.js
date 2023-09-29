"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const os_1 = __importStar(require("os"));
const locateToolsRelease_1 = __importDefault(require("./locateToolsRelease"));
const log_1 = __importStar(require("./log"));
const path_1 = require("path");
const executeCommand_1 = __importDefault(require("./executeCommand"));
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const downloadFile_1 = __importDefault(require("./downloadFile"));
function installAppMapTools(toolsPath, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, fs_1.existsSync)(toolsPath) && !options.force) {
            (0, log_1.default)(log_1.LogLevel.Info, `AppMap tools are already installed at ${toolsPath}. Skipping this step...`);
            return;
        }
        const platform = [os_1.default.platform() === 'darwin' ? 'macos' : os_1.default.platform(), os_1.default.arch()].join('-');
        const toolsReleaseURL = options.toolsURL || (yield (0, locateToolsRelease_1.default)(platform, options.githubToken));
        if (!toolsReleaseURL)
            throw new Error('Could not find @appland/appmap release');
        (0, log_1.default)(log_1.LogLevel.Info, `Installing AppMap tools from ${toolsReleaseURL}`);
        const tempDir = yield (0, promises_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), 'appmap-tools-'));
        const appmapTempPath = (0, path_1.join)(tempDir, 'appmap');
        yield (0, downloadFile_1.default)(new URL(toolsReleaseURL), appmapTempPath);
        try {
            yield (0, executeCommand_1.default)(`mv ${appmapTempPath} ${toolsPath}`);
        }
        catch (e) {
            yield (0, executeCommand_1.default)(`sudo mv ${appmapTempPath} ${toolsPath}`);
        }
        yield (0, promises_1.chmod)(toolsPath, 0o755);
        yield (0, promises_1.rm)(tempDir, { recursive: true });
        (0, log_1.default)(log_1.LogLevel.Info, `AppMap tools are installed at ${toolsPath}`);
    });
}
exports.default = installAppMapTools;
