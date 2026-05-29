export = createLogger;
/**
 * Creates a logger instance with configured symbols, colors and output behavior.
 *
 * @param {LoggerConfig} [params] Logger configuration options.
 * @returns {Logger} Logger methods and contextual logger factory.
 */
declare function createLogger(params?: LoggerConfig): Logger;
declare namespace createLogger {
    export { LogSymbols, LogColors, DateFormat, LogLevel, LoggerConfig, LoggerMethods, Logger };
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
type LogColors = {
    success?: string;
    fail?: string;
    warn?: string;
    error?: string;
    info?: string;
    log?: string;
    alert?: string;
    crit?: string;
    warning?: string;
    debug?: string;
    silly?: string;
};
type DateFormat = "iso" | "locale" | "unix";
type LogLevel = "silly" | "debug" | "log" | "info" | "success" | "warn" | "warning" | "fail" | "alert" | "error" | "crit";
type LoggerConfig = {
    /**
     * Enables timestamp prefix in each log line.
     */
    timestamp?: boolean;
    /**
     * Format for the timestamp when timestamp is enabled.
     */
    dateFormat?: DateFormat;
    /**
     * Hides textual level prefixes such as "Info:".
     */
    disablePrefixText?: boolean;
    /**
     * Custom emoji symbols for each log level.
     */
    logSymbols?: LogSymbols;
    /**
     * Custom ANSI escape code colors for each log level.
     */
    logColors?: LogColors;
    /**
     * Minimum log level to output. Levels below this are suppressed.
     */
    minLevel?: LogLevel;
    /**
     * Explicit allowlist of levels to output. Takes precedence over minLevel.
     */
    levels?: LogLevel[];
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
    createContext: (context: string) => Logger;
};
//# sourceMappingURL=index.d.ts.map