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
```

```javascript
logger.fail("You're suck!");

// Output:  📛 You're suck
```

```javascript
logger.error("Oh crap!");

// Output: 🚨 Oh crap!
```

```javascript
logger.warn("Oops!");

// Output: 🟠 Oops!
```

```javascript
logger.log("Debug");

// Output: 📄 Debug
```

# Context Logger

Use `createContext` to create a child logger that prefixes every log with a context label. Useful for identifying which module or service a log comes from.

```javascript
const authLogger = logger.createContext("1 | 938594940 |");

authLogger.info("User logged in");
// Output: 📄 Info: 1 | 938594940 | User logged in

authLogger.error("Token expired");
// Output: 🚨 Error: 1 | 938594940 | Token expired
```
