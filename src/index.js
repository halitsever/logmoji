const ConfigClass = require("./config.class");
const getDateLog = require("./utils/get-date-log");

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

    const timestamp = config?.timestamp ? getDateLog() : "";
    const isLoggingDisabled = config?.isLoggingDisabled;
    const contextPrefix = context ? ` ${context}` : "";

    if (isLoggingDisabled) return;
    logFunction[level](
      `${logColors[level]}${timestamp} ${logSymbols[level]}${config?.disablePrefixText ? "" : " " + level.charAt(0).toUpperCase() + level.slice(1) + ":"}${contextPrefix}`,
      ...args,
      logColors.clear,
    );
  };

  /**
   * Creates level-specific logging methods with an immutable context prefix.
   *
   * @param {string} context Context label shown before message payload.
   * @returns {LoggerMethods} Context-bound logger methods.
   */
  const createContext = (context) => ({
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
  });

  return {
    success: (...args) => log("success", "", ...args),
    fail: (...args) => log("fail", "", ...args),
    error: (...args) => log("error", "", ...args),
    info: (...args) => log("info", "", ...args),
    warn: (...args) => log("warn", "", ...args),
    log: (...args) => log("log", "", ...args),
    alert: (...args) => log("alert", "", ...args),
    crit: (...args) => log("crit", "", ...args),
    warning: (...args) => log("warning", "", ...args),
    debug: (...args) => log("debug", "", ...args),
    silly: (...args) => log("silly", "", ...args),
    createContext,
  };
};

module.exports = createLogger;
