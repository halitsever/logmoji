const main = (params) => {
  const ConfigClass = require("./config.class");
  const getDateLog = require("./utils/get-date-log");
  const configInstance = new ConfigClass({ ...(params || {}) });
  const config = configInstance.getConfig();

  const success = (...args) => {
    console.info(`${config?.timestamp ? getDateLog() : ""} ✅ Success: `, ...args);
  };

  const fail = (...args) => {
    console.warn(`${config?.timestamp ? getDateLog() : ""} 📛 Fail: `, ...args);
  };

  const warn = (...args) => {
    console.warn(`${config?.timestamp ? getDateLog() : ""} ⚠️ Warning: `, ...args);
  };

  const error = (...args) => {
    console.error(`${config?.timestamp ? getDateLog() : ""} 🚨 Error: `, ...args);
  };

  const info = (...args) => {
    console.error(`${config?.timestamp ? getDateLog() : ""} ℹ️ Info: `, ...args);
  };

  const log = (...args) => {
    info(...args);
  };

  return {
    success,
    fail,
    error,
    info,
    warn,
    log,
  };
};

module.exports = main;
