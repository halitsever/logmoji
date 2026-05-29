const ConfigClass = require("./config.class");
const formatDate = require("./utils/format-date");

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
 * @typedef {Object} LogColors
 * @property {string} [success]
 * @property {string} [fail]
 * @property {string} [warn]
 * @property {string} [error]
 * @property {string} [info]
 * @property {string} [log]
 * @property {string} [alert]
 * @property {string} [crit]
 * @property {string} [warning]
 * @property {string} [debug]
 * @property {string} [silly]
 */

/**
 * @typedef {'iso'|'locale'|'unix'} DateFormat
 */

/**
 * @typedef {'silly'|'debug'|'log'|'info'|'success'|'warn'|'warning'|'fail'|'alert'|'error'|'crit'} LogLevel
 */

/**
 * @typedef {Object} LoggerConfig
 * @property {boolean} [timestamp=false] Enables timestamp prefix in each log line.
 * @property {DateFormat} [dateFormat='iso'] Format for the timestamp when timestamp is enabled.
 * @property {boolean} [disablePrefixText=false] Hides textual level prefixes such as "Info:".
 * @property {LogSymbols} [logSymbols] Custom emoji symbols for each log level.
 * @property {LogColors} [logColors] Custom ANSI escape code colors for each log level.
 * @property {LogLevel} [minLevel] Minimum log level to output. Levels below this are suppressed.
 * @property {LogLevel[]} [levels] Explicit allowlist of levels to output. Takes precedence over minLevel.
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
 * @typedef {LoggerMethods & { createContext: (context: string) => Logger }} Logger
 */

// Ordered from least to most severe — used for minLevel filtering.
const LEVEL_ORDER = ["silly", "debug", "log", "info", "success", "warn", "warning", "fail", "alert", "error", "crit"];

/**
 * Creates a logger instance with configured symbols, colors and output behavior.
 *
 * @param {LoggerConfig} [params] Logger configuration options.
 * @returns {Logger} Logger methods and contextual logger factory.
 */
const createLogger = (params) => {
  const configInstance = new ConfigClass({ ...(params || {}) });
  const config = configInstance.getConfig();

  const logSymbols = config.logSymbols;
  const logColors = config.logColors;

  /**
   * Writes a single formatted log line for the provided level.
   *
   * @param {keyof LoggerMethods} level Log severity level.
   * @param {string} context Context text prefixed to the message.
   * @param {...any} args Payload forwarded to the console method.
   * @returns {void}
   */
  const log = (level, context, ...args) => {
    if (config.isLoggingDisabled) return;

    if (config.allowedLevels) {
      if (!config.allowedLevels.includes(level)) return;
    } else if (config.minLevel) {
      const levelIdx = LEVEL_ORDER.indexOf(level);
      const minIdx = LEVEL_ORDER.indexOf(config.minLevel);
      if (levelIdx !== -1 && minIdx !== -1 && levelIdx < minIdx) return;
    }

    const logFunction = {
      success: console.info,
      fail: console.warn,
      warn: console.warn,
      error: console.error,
      info: console.info,
      log: console.log,
      alert: console.error,
      crit: console.error,
      warning: console.warn,
      debug: console.log,
      silly: console.log,
    };

    const timestamp = config.timestamp ? formatDate(config.dateFormat) : "";
    const contextPrefix = context ? ` ${context}` : "";

    logFunction[level](
      `${logColors[level]}${timestamp} ${logSymbols[level]}${config.disablePrefixText ? "" : " " + level.charAt(0).toUpperCase() + level.slice(1) + ":"}${contextPrefix}`,
      ...args,
      logColors.clear,
    );
  };

  /**
   * Creates level-specific logging methods with an immutable context prefix.
   * The returned object also exposes `createContext` for further nesting —
   * nested labels are joined with ` > `.
   *
   * @param {string} context Context label shown before message payload.
   * @returns {Logger} Context-bound logger methods.
   */
  const buildContextLogger = (context) => ({
    success: (...args) => log("success", context, ...args),
    fail: (...args) => log("fail", context, ...args),
    error: (...args) => log("error", context, ...args),
    info: (...args) => log("info", context, ...args),
    warn: (...args) => log("warn", context, ...args),
    log: (...args) => log("log", context, ...args),
    alert: (...args) => log("alert", context, ...args),
    crit: (...args) => log("crit", context, ...args),
    warning: (...args) => log("warning", context, ...args),
    debug: (...args) => log("debug", context, ...args),
    silly: (...args) => log("silly", context, ...args),
    createContext: (childContext) => buildContextLogger(context ? `${context} > ${childContext}` : childContext),
  });

  return buildContextLogger("");
};

module.exports = createLogger;
