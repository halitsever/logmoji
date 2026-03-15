const ConfigClass = require("./config.class");
const getDateLog = require("./utils/get-date-log");

const createLogger = (params) => {
  const configInstance = new ConfigClass({ ...(params || {}) });
  const config = configInstance.getConfig();

  const logSymbols = config.logSymbols;
  const logColors = config.logColors;

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
