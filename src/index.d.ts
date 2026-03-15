import { ConfigOptions } from './config.class';

export interface Logger {
    success: (...args: any[]) => void;
    fail: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    log: (...args: any[]) => void;
    alert: (...args: any[]) => void;
    crit: (...args: any[]) => void;
    warning: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    silly: (...args: any[]) => void;
}

type LogLevel = 'success' | 'fail' | 'error' | 'info' | 'warn' | 'log' | 'alert' | 'crit' | 'warning' | 'debug' | 'silly';

export default function createLogger(params?: ConfigOptions): Logger;

