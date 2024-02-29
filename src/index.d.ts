import { ConfigOptions } from './config.class';

export interface Logger {
    success: (...args: any[]) => void;
    fail: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    log: (...args: any[]) => void;
}

type LogLevel = 'success' | 'fail' | 'error' | 'info' | 'warn' | 'log';

export declare function createLogger(params?: ConfigOptions): Logger;

