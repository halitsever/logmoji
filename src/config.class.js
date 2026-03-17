/**
 * Builds and validates runtime logger configuration.
 */
class ConfigClass {
  /**
   * @param {Object} params Constructor options.
   * @param {boolean} [params.timestamp=false] Enables timestamp output.
   * @param {boolean} [params.disablePrefixText=false] Hides textual level prefixes.
   * @param {Object} [params.logSymbols] Custom emoji symbols by level.
   */
  constructor({ timestamp, disablePrefixText, logSymbols }) {
    this.config = {
      timestamp: timestamp || false,
      isLoggingDisabled: process.env.LOG || false,
      disablePrefixText: disablePrefixText || false,
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
   * Gets the normalized logger configuration.
   *
   * @returns {Object}
   */
  getConfig() {
    return this.config;
  }
}

module.exports = ConfigClass;
