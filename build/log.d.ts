export declare enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warn = "warn"
}
export interface Logger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
}
export declare class ActionLogger implements Logger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
}
export declare function setLogger(logger: Logger): void;
export default function log(level: LogLevel, message: string): void;
