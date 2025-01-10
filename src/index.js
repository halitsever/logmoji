const ConfigClass = require("./config.class");
const getDateLog = require("./utils/get-date-log");

const createLogger = (params) => {
  const configInstance = new ConfigClass({ ...(params || {}) });
  const config = configInstance.getConfig();

  const logSymbols = config.logSymbols;
  const logColors = config.logColors;

  const log = (level, ...args) => {
    const logFunction = {
      success: console.info,
      fail: console.warn,
      warn: console.warn,
      error: console.error,
      info: console.info,
      log: console.log,
    };

    const timestamp = config?.timestamp ? getDateLog() : "";
    const isLoggingDisabled = config?.isLoggingDisabled;

    if (isLoggingDisabled) return;
    logFunction[level](
      `${logColors[level]}${timestamp} ${logSymbols[level]} ${config?.disablePrefixText ? "" : level.charAt(0).toUpperCase() + level.slice(1) + ": "}`,
      ...args,
      logColors.clear
    );
  };

  return {
    success: (...args) => log("success", ...args),
    fail: (...args) => log("fail", ...args),
    error: (...args) => log("error", ...args),
    info: (...args) => log("info", ...args),
    warn: (...args) => log("warn", ...args),
    log: (...args) => log("log", ...args),
  };
};

module.exports = createLogger;
