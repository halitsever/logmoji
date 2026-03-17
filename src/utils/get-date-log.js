/**
 * Returns current date-time in ISO format enclosed with brackets.
 *
 * @returns {string}
 */
const getDateLog = () => {
  return `[${new Date().toISOString()}]`;
};

module.exports = getDateLog;
