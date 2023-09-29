/// <reference types="node" />
import { ExecOptions } from 'child_process';
export type Command = {
    cmd: string | string[];
    options?: ExecOptions;
};
export type ExecuteOptionFlags = {
    printCommand?: boolean;
    printStdout?: boolean;
    printStderr?: boolean;
    allowedCodes?: number[];
};
export declare class ExecuteOptions {
    printCommand: boolean;
    printStdout: boolean;
    printStderr: boolean;
    allowedCodes: number[];
}
export default function executeCommand(cmd: string | Command, options?: ExecuteOptionFlags): Promise<string>;
