export = ConfigClass;
/**
 * Builds and validates runtime logger configuration.
 */
declare class ConfigClass {
    /**
     * @param {Object} params Constructor options.
     * @param {boolean} [params.timestamp=false] Enables timestamp output.
     * @param {boolean} [params.disablePrefixText=false] Hides textual level prefixes.
     * @param {Object} [params.logSymbols] Custom emoji symbols by level.
     */
    constructor({ timestamp, disablePrefixText, logSymbols }: {
        timestamp?: boolean;
        disablePrefixText?: boolean;
        logSymbols?: any;
    });
    config: {
        timestamp: boolean;
        isLoggingDisabled: string | boolean;
        disablePrefixText: boolean;
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
     * Gets the normalized logger configuration.
     *
     * @returns {Object}
     */
    getConfig(): any;
}
//# sourceMappingURL=config.class.d.ts.map