export = ConfigClass;
/**
 * Builds and validates runtime logger configuration.
 */
declare class ConfigClass {
    /**
     * @param {Object} params Constructor options.
     * @param {boolean} [params.timestamp=false] Enables timestamp output.
     * @param {'iso'|'locale'|'unix'} [params.dateFormat='iso'] Timestamp format when timestamp is enabled.
     * @param {boolean} [params.disablePrefixText=false] Hides textual level prefixes.
     * @param {Object} [params.logSymbols] Custom emoji symbols by level.
     * @param {Object} [params.logColors] Custom ANSI color codes by level.
     * @param {string} [params.minLevel] Minimum log level to output — levels below this are suppressed.
     * @param {string[]} [params.levels] Explicit allowlist of log levels to output. Takes precedence over minLevel.
     */
    constructor({ timestamp, dateFormat, disablePrefixText, logSymbols, logColors, minLevel, levels }: {
        timestamp?: boolean;
        dateFormat?: "iso" | "locale" | "unix";
        disablePrefixText?: boolean;
        logSymbols?: any;
        logColors?: any;
        minLevel?: string;
        levels?: string[];
    });
    config: {
        timestamp: boolean;
        dateFormat: "iso" | "locale" | "unix";
        isLoggingDisabled: boolean;
        disablePrefixText: boolean;
        minLevel: string;
        allowedLevels: string[];
        logSymbols: {
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
        logColors: {
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
            clear: string;
        };
    };
    /**
     * Returns a valid emoji character or `null` when the input is not an emoji.
     *
     * @param {string} emoji Value to validate.
     * @returns {string|null}
     */
    validateEmoji(emoji: string): string | null;
    /**
     * Returns a valid ANSI escape color code or `null` when the input is not a valid ANSI code.
     *
     * @param {string} color Value to validate.
     * @returns {string|null}
     */
    validateAnsiColor(color: string): string | null;
    /**
     * Gets the normalized logger configuration.
     *
     * @returns {Object}
     */
    getConfig(): any;
}
//# sourceMappingURL=config.class.d.ts.map