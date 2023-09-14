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
exports.ExecuteOptions = void 0;
const child_process_1 = require("child_process");
const log_1 = __importStar(require("./log"));
const verbose_1 = __importDefault(require("./verbose"));
const assert_1 = __importDefault(require("assert"));
class ExecuteOptions {
    constructor() {
        this.printCommand = (0, verbose_1.default)();
        this.printStdout = (0, verbose_1.default)();
        this.printStderr = (0, verbose_1.default)();
        this.allowedCodes = [0];
    }
}
exports.ExecuteOptions = ExecuteOptions;
function executeCommand(cmd, options = new ExecuteOptions()) {
    return __awaiter(this, void 0, void 0, function* () {
        function commandArgs(cmdStr) {
            const args = cmdStr.split(' ');
            const cmd = args.shift();
            (0, assert_1.default)(cmd);
            return [cmd, args];
        }
        let command;
        let commandString;
        const allowedCodes = options.allowedCodes || [0];
        if (typeof cmd === 'string') {
            commandString = cmd;
            command = (0, child_process_1.spawn)(...commandArgs(cmd));
        }
        else {
            commandString = cmd.cmd;
            const args = commandArgs(cmd.cmd);
            command = (0, child_process_1.spawn)(...args, cmd.options || {});
        }
        if (options.printCommand)
            (0, log_1.default)(log_1.LogLevel.Debug, ['command', commandString].join(': '));
        const result = [];
        const stderr = [];
        if (command.stdout) {
            command.stdout.addListener('data', data => {
                if (options.printStdout)
                    (0, log_1.default)(log_1.LogLevel.Debug, ['stdout', data.toString('utf-8')].join(': '));
                result.push(data);
            });
        }
        if (command.stderr) {
            command.stderr.addListener('data', data => {
                if (options.printStderr)
                    (0, log_1.default)(log_1.LogLevel.Debug, ['stderr', data.toString('utf-8')].join(': '));
                stderr.push(data);
            });
        }
        return new Promise((resolve, reject) => {
            command.on('error', (err) => {
                (0, log_1.default)(log_1.LogLevel.Warn, `Command "${commandString}" could not be executed: ${err}`);
                reject(err);
            });
            command.on('close', (code, signal) => {
                if (signal || (code !== null && allowedCodes.includes(code))) {
                    if (signal)
                        (0, log_1.default)(log_1.LogLevel.Warn, `Command "${commandString}" killed by signal ${signal}, exited with code ${code}`);
                    if (code !== 0)
                        (0, log_1.default)(log_1.LogLevel.Info, `Command "${commandString}" exited with code ${code}, but any of [${allowedCodes.join(', ')}] is allowed.`);
                    resolve(result.map(d => d.toString('utf-8')).join(''));
                }
                else {
                    (0, log_1.default)(log_1.LogLevel.Warn, `Command "${commandString}" exited with failure code ${code}`);
                    (0, log_1.default)(log_1.LogLevel.Warn, stderr.join(''));
                    (0, log_1.default)(log_1.LogLevel.Warn, result.join(''));
                    reject(new Error(`Command failed with code ${code}`));
                }
            });
        });
    });
}
exports.default = executeCommand;
