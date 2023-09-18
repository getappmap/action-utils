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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogger = exports.ActionLogger = exports.LogLevel = void 0;
const core = __importStar(require("@actions/core"));
var LogLevel;
(function (LogLevel) {
    LogLevel["Debug"] = "debug";
    LogLevel["Info"] = "info";
    LogLevel["Warn"] = "warn";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class ActionLogger {
    debug(message) {
        core.debug(message);
    }
    info(message) {
        core.info(message);
    }
    warn(message) {
        core.warning(message);
    }
}
exports.ActionLogger = ActionLogger;
let Logger;
function setLogger(logger) {
    Logger = logger;
}
exports.setLogger = setLogger;
function log(level, message) {
    if (!Logger) {
        if (message.endsWith('\n'))
            message = message.slice(0, -1);
        console[level](message);
        return;
    }
    Logger[level](message);
}
exports.default = log;
