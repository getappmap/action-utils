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
const node_fetch_1 = __importDefault(require("node-fetch"));
const log_1 = __importStar(require("./log"));
function locateToolsRelease(platform, githubToken, retryDelay = 3000) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        let page = 1;
        while (!result) {
            const url = `https://api.github.com/repos/applandinc/appmap-js/releases?page=${page}&per_page=100`;
            (0, log_1.default)(log_1.LogLevel.Debug, `Enumerating appmap-js releases: ${url}`);
            const headers = {
                Accept: 'application/vnd.github+json',
            };
            if (githubToken)
                headers['Authorization'] = `Bearer ${githubToken}`;
            const response = yield (0, node_fetch_1.default)(url, {
                headers,
            });
            if (response.status === 403) {
                let message;
                try {
                    message = (yield response.json()).message;
                }
                catch (e) {
                    (0, log_1.default)(log_1.LogLevel.Warn, e.toString());
                    message = `GitHub API rate limit likely exceeded: ${e}`;
                }
                (0, log_1.default)(log_1.LogLevel.Info, [`Received status code 'Forbidden' listing appmap-js releases (`, message, ')'].join(''));
                (0, log_1.default)(log_1.LogLevel.Debug, `Waiting for ${retryDelay / 1000.0} seconds.`);
                (0, log_1.default)(log_1.LogLevel.Info, `You can avoid the rate limit by setting 'github-token: \${{ secrets.GITHUB_TOKEN }}'`);
                yield new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }
            else if (response.status > 400) {
                throw new Error(`GitHub API returned ${response.status} ${response.statusText}`);
            }
            const releases = yield response.json();
            if (releases.length === 0)
                break;
            page += 1;
            const release = releases.find((release) => /^@appland\/appmap-v\d+\./.test(release.name));
            if (release) {
                (0, log_1.default)(log_1.LogLevel.Info, `Using @appland/appmap release ${release.name} for ${platform}`);
                result = release.assets.find((asset) => asset.name === `appmap-${platform}`).browser_download_url;
            }
        }
        return result;
    });
}
exports.default = locateToolsRelease;
