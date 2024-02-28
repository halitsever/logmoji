declare module 'index' {
    interface Logger {
        success: (...args: any[]) => void;
        fail: (...args: any[]) => void;
        error: (...args: any[]) => void;
        info: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        log: (...args: any[]) => void;
    }

    type LogLevel = 'success' | 'fail' | 'error' | 'info' | 'warn' | 'log';

    interface LoggerOptions {
        // Define your configuration options here if any
        // For example:
        // timestamp?: boolean;
    }

    function createLogger(params?: LoggerOptions): Logger;

    export = createLogger;
}
