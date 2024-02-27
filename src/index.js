const success = (...args) => {
  console.info(`✅ Success: `, ...args);
};

const fail = (...args) => {
  console.warn(`📛 Fail: `, ...args);
};

const warn = (...args) => {
  console.warn(`⚠️ Warning: `, ...args);
};

const error = (...args) => {
  console.error(`🚨 Error: `, ...args);
};

const info = (...args) => {
  console.error(`ℹ️ Info: `, ...args);
};

module.exports = {
  success,
  fail,
  error,
  info,
  warn,
};
