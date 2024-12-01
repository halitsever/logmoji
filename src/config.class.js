class ConfigClass {
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
        info: this.validateEmoji(logSymbols?.info) || "ℹ️",
        log: this.validateEmoji(logSymbols?.log) || "📄",
      },
      logColors: {
        success: "\x1b[32m",
        fail: "\x1b[31m",
        warn: "\x1b[33m",
        error: "\x1b[31m",
        info: "\x1b[36m",
        log: "\x1b[37m",
      },
    };
  }

  validateEmoji(emoji) {
    const emojiRegex = /\p{Emoji}/u;
    return emojiRegex.test(emoji) ? emoji : null;
  }

  getConfig() {
    return this.config;
  }
}

module.exports = ConfigClass;
