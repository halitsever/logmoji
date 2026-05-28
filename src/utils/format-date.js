/**
 * Returns current date-time in the specified format enclosed with brackets.
 *
 * @param {'iso'|'locale'|'unix'} [format='iso']
 * @returns {string}
 */
const formatDate = (format = "iso") => {
  const now = new Date();
  const formats = {
    iso: () => now.toISOString(),
    locale: () => now.toLocaleString(),
    unix: () => String(Date.now()),
  };
  const fn = Object.hasOwn(formats, format) ? formats[format] : formats.iso;
  return `[${fn()}]`;
};

module.exports = formatDate;
