---
title: Configuration
description: "Configure logmoji: timestamps, date formats, minimum log level, level allowlist, custom emojis and console log colors."
---

# Options for createLogger(): timestamps, levels, emojis and colors

Pass an options object to `createLogger()` to customize behavior.

```javascript
const logger = require("logmoji")({
  timestamp: true,
  dateFormat: "iso",
  minLevel: "info",
  disablePrefixText: false,
  logSymbols: { success: "🚀" },
  logColors: { error: "\x1b[91m" },
});
```

## Parameters

| Option | Type | Default | Description |
|---|---|---|---|
| `timestamp` | `boolean` | `false` | Prepends a timestamp to every log line. |
| `dateFormat` | `'iso' \| 'locale' \| 'unix'` | `'iso'` | Timestamp format. Only takes effect when `timestamp` is `true`. |
| `disablePrefixText` | `boolean` | `false` | Omits the level label (e.g. `Info:`) from output. |
| `logSymbols` | `LogSymbols` | see below | Override emoji for any log level. |
| `logColors` | `LogColors` | see below | Override ANSI color code for any log level. |
| `minLevel` | `LogLevel` | _(none)_ | Suppress all log levels below this one. |
| `levels` | `LogLevel[]` | _(none)_ | Explicit allowlist — only these levels are output. Takes precedence over `minLevel`. |

## dateFormat options

| Value | Example output |
|---|---|
| `'iso'` | `[2024-01-15T10:30:00.000Z]` |
| `'locale'` | `[1/15/2024, 10:30:00 AM]` |
| `'unix'` | `[1705312200000]` |

## minLevel — log level order

Levels ordered from least to most severe:

```
silly → debug → log → info → success → warn → warning → fail → alert → error → crit
```

Setting `minLevel: "warn"` will suppress `silly`, `debug`, `log`, `info`, and `success`.

## Default symbols

```javascript
{
  success: "✅", fail: "📛",   warn: "🟠",  error: "🚨",
  info:    "📄", log:  "📄",   alert: "😡", crit:  "😱",
  warning: "⚠️", debug: "🛠️", silly: "🤪",
}
```

## Console log colors

Each level has its own color. The logger writes the level's ANSI escape code before the line and `\x1b[0m` after it, so the color resets before the next line. The codes are written even when output goes to a file or a pipe. These are the defaults:

```javascript
{
  success: "\x1b[32m",  // green
  fail:    "\x1b[31m",  // red
  error:   "\x1b[31m",  // red
  warn:    "\x1b[33m",  // yellow
  warning: "\x1b[33m",  // yellow
  alert:   "\x1b[91m",  // bright red
  crit:    "\x1b[35m",  // magenta
  debug:   "\x1b[90m",  // dark gray
  silly:   "\x1b[2m",   // dim
  info:    "\x1b[0m",   // default
  log:     "\x1b[0m",   // default
}
```

Custom colors must be valid ANSI escape codes (e.g. `"\x1b[34m"`). Invalid values silently fall back to the default. The [console log colors picker](/console-log-colors/) builds this object for you with a live preview.

## warn vs warning

Both `warn` and `warning` are kept for convenience. They use the same console method (`console.warn`) but have different default emojis (`🟠` vs `⚠️`). In terms of `minLevel` priority, `warning` ranks one step above `warn`.

## Disabling logs in production

Set the `LOGMOJI_DISABLE` environment variable to `"true"`:

```bash
LOGMOJI_DISABLE=true node app.js
```

Or in your `.env` file:

```
LOGMOJI_DISABLE=true
```
