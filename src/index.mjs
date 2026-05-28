import { createRequire } from "module";

const require = createRequire(import.meta.url);
const createLogger = require("./index.js");

export default createLogger;
export { createLogger };
