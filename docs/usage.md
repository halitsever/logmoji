# Installation

```bash
npm install --save logmoji
```

# Usage

```javascript
const logger = require("logmoji")({
  timestamp: false,
  disablePrefixText: false,
  logSymbols: {
    success: "🗣️",
  },
});

logger.success("You did it!");

// Output:  🗣️ You did it
```

# Available Log Functions

```javascript
logger.success("You did it!");
// Output:  ✅ You did it

logger.fail("You're suck!");
// Output:  📛 You're suck

logger.error("Oh crap!");
// Output: 🚨 Oh crap!

logger.warn("Oops!");
// Output: 🟠 Oops!

logger.warning("Heads up!");
// Output: ⚠️ Heads up!

logger.info("FYI");
// Output: 📄 Info: FYI

logger.log("Something happened");
// Output: 📄 Log: Something happened

logger.alert("Action required!");
// Output: 😡 Alert: Action required!

logger.crit("System is down!");
// Output: 😱 Crit: System is down!

logger.debug("x = 42");
// Output: 🛠️ Debug: x = 42

logger.silly("wheee");
// Output: 🤪 Silly: wheee
```

# Context Logger

Use `createContext` to create a child logger that prefixes every log with a context label. Useful for identifying which module or service a log comes from.

```javascript
const authLogger = logger.createContext("Auth");

authLogger.info("User logged in");
// Output: 📄 Info: Auth User logged in

authLogger.error("Token expired");
// Output: 🚨 Error: Auth Token expired
```

## Nested contexts

`createContext` can be chained to build hierarchical labels. Each level is joined with ` > `.

```javascript
const httpLogger = logger.createContext("HTTP");
const reqLogger = httpLogger.createContext("GET /users");

reqLogger.info("Request received");
// Output: 📄 Info: HTTP > GET /users Request received

reqLogger.error("Unauthorized");
// Output: 🚨 Error: HTTP > GET /users Unauthorized
```

# Filtering by log level

Use `minLevel` to suppress output below a certain severity:

```javascript
const logger = require("logmoji")({ minLevel: "warn" });

logger.debug("ignored");   // suppressed
logger.info("also ignored"); // suppressed
logger.warn("shown");      // shown
logger.error("shown");     // shown
```

Level order (least → most severe):
`silly → debug → log → info → success → warn → warning → fail → alert → error → crit`
