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
