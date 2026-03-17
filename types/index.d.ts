export = createLogger;
/**
 * @typedef {Object} LogSymbols
 * @property {string} success
 * @property {string} fail
 * @property {string} warn
 * @property {string} error
 * @property {string} info
 * @property {string} log
 * @property {string} alert
 * @property {string} crit
 * @property {string} warning
 * @property {string} debug
 * @property {string} silly
 */
/**
 * @typedef {Object} LoggerConfig
 * @property {boolean} [timestamp=false] Enables ISO timestamp prefix in each log line.
 * @property {boolean} [disablePrefixText=false] Hides textual level prefixes such as "Info:".
 * @property {LogSymbols} [logSymbols] Custom symbols for each log level.
 */
/**
 * @typedef {Object} LoggerMethods
 * @property {(...args: any[]) => void} success
 * @property {(...args: any[]) => void} fail
 * @property {(...args: any[]) => void} error
 * @property {(...args: any[]) => void} info
 * @property {(...args: any[]) => void} warn
 * @property {(...args: any[]) => void} log
 * @property {(...args: any[]) => void} alert
 * @property {(...args: any[]) => void} crit
 * @property {(...args: any[]) => void} warning
 * @property {(...args: any[]) => void} debug
 * @property {(...args: any[]) => void} silly
 */
/**
 * @typedef {LoggerMethods & { createContext: (context: string) => LoggerMethods }} Logger
 */
/**
 * Creates a logger instance with configured symbols, colors and output behavior.
 *
 * @param {LoggerConfig} [params] Logger configuration options.
 * @returns {Logger} Logger methods and contextual logger factory.
 */
declare function createLogger(params?: LoggerConfig): Logger;
declare namespace createLogger {
    export { LogSymbols, LoggerConfig, LoggerMethods, Logger };
}
type LogSymbols = {
    success: string;
    fail: string;
    warn: string;
    error: string;
    info: string;
    log: string;
    alert: string;
    crit: string;
    warning: string;
    debug: string;
    silly: string;
};
type LoggerConfig = {
    /**
     * Enables ISO timestamp prefix in each log line.
     */
    timestamp?: boolean;
    /**
     * Hides textual level prefixes such as "Info:".
     */
    disablePrefixText?: boolean;
    /**
     * Custom symbols for each log level.
     */
    logSymbols?: LogSymbols;
};
type LoggerMethods = {
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
};
type Logger = LoggerMethods & {
    createContext: (context: string) => LoggerMethods;
};
//# sourceMappingURL=index.d.ts.map