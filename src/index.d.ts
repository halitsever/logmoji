declare module 'index' {
    import ConfigClass = require('config.class');

    interface Logger {
        success: (...args: any[]) => void;
        fail: (...args: any[]) => void;
        error: (...args: any[]) => void;
        info: (...args: any[]) => void;
        warn: (...args: any[]) => void;
        log: (...args: any[]) => void;
    }

    type LogLevel = 'success' | 'fail' | 'error' | 'info' | 'warn' | 'log';

    function createLogger(params?: ConfigClass.ConfigOptions): Logger;

    export = createLogger;
}