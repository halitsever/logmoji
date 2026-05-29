const VALID_LEVELS = ["silly", "debug", "log", "info", "success", "warn", "warning", "fail", "alert", "error", "crit"];

/**
 * Builds and validates runtime logger configuration.
 */
class ConfigClass {
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
  constructor({ timestamp, dateFormat, disablePrefixText, logSymbols, logColors, minLevel, levels }) {
    const defaultColors = {
      success: "\x1b[32m",
      fail: "\x1b[31m",
      warn: "\x1b[33m",
      error: "\x1b[31m",
      info: "\x1b[0m",
      log: "\x1b[0m",
      alert: "\x1b[91m",
      crit: "\x1b[35m",
      warning: "\x1b[33m",
      debug: "\x1b[90m",
      silly: "\x1b[2m",
      clear: "\x1b[0m",
    };

    this.config = {
      timestamp: timestamp || false,
      dateFormat: ["iso", "locale", "unix"].includes(dateFormat) ? dateFormat : "iso",
      isLoggingDisabled: process.env.LOGMOJI_DISABLE === "true",
      disablePrefixText: disablePrefixText || false,
      minLevel: minLevel || null,
      allowedLevels: Array.isArray(levels) && levels.length > 0 ? levels.filter((l) => VALID_LEVELS.includes(l)) : null,
      logSymbols: {
        success: this.validateEmoji(logSymbols?.success) || "✅",
        fail: this.validateEmoji(logSymbols?.fail) || "📛",
        warn: this.validateEmoji(logSymbols?.warn) || "🟠",
        error: this.validateEmoji(logSymbols?.error) || "🚨",
        info: this.validateEmoji(logSymbols?.info) || "📄",
        log: this.validateEmoji(logSymbols?.log) || "📄",
        alert: this.validateEmoji(logSymbols?.alert) || "😡",
        crit: this.validateEmoji(logSymbols?.crit) || "😱",
        warning: this.validateEmoji(logSymbols?.warning) || "⚠️",
        debug: this.validateEmoji(logSymbols?.debug) || "🛠️",
        silly: this.validateEmoji(logSymbols?.silly) || "🤪",
      },
      logColors: {
        success: this.validateAnsiColor(logColors?.success) || defaultColors.success,
        fail: this.validateAnsiColor(logColors?.fail) || defaultColors.fail,
        warn: this.validateAnsiColor(logColors?.warn) || defaultColors.warn,
        error: this.validateAnsiColor(logColors?.error) || defaultColors.error,
        info: this.validateAnsiColor(logColors?.info) || defaultColors.info,
        log: this.validateAnsiColor(logColors?.log) || defaultColors.log,
        alert: this.validateAnsiColor(logColors?.alert) || defaultColors.alert,
        crit: this.validateAnsiColor(logColors?.crit) || defaultColors.crit,
        warning: this.validateAnsiColor(logColors?.warning) || defaultColors.warning,
        debug: this.validateAnsiColor(logColors?.debug) || defaultColors.debug,
        silly: this.validateAnsiColor(logColors?.silly) || defaultColors.silly,
        clear: "\x1b[0m",
      },
    };
  }

  /**
   * Returns a valid emoji character or `null` when the input is not an emoji.
   *
   * @param {string} emoji Value to validate.
   * @returns {string|null}
   */
  validateEmoji(emoji) {
    const emojiRegex = /\p{Emoji}/u;
    return emojiRegex.test(emoji) ? emoji : null;
  }

  /**
   * Returns a valid ANSI escape color code or `null` when the input is not a valid ANSI code.
   *
   * @param {string} color Value to validate.
   * @returns {string|null}
   */
  validateAnsiColor(color) {
    const ansiRegex = /^\x1b\[\d+(;\d+)*m$/;
    return typeof color === "string" && ansiRegex.test(color) ? color : null;
  }

  /**
   * Gets the normalized logger configuration.
   *
   * @returns {Object}
   */
  getConfig() {
    return this.config;
  }
}

module.exports = ConfigClass;
