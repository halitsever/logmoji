---
title: "Console Log Colors: ANSI Code Picker for Node.js"
titleTemplate: false
description: "Pick console log colors for each Node.js log level, preview them in a terminal, and copy the ANSI codes as a ready logColors config for logmoji."
outline: [2, 2]
---

<script setup>
import LogColorPicker from '../.vitepress/components/LogColorPicker.vue'
</script>

# Pick console log colors for every log level

Choose a color and a style for each of logmoji's 11 log levels. The preview shows how the lines look in a dark terminal, and the box below it holds the matching `logColors` config to paste into your code. Everything runs in your browser.

<LogColorPicker />

The preview uses typical dark-theme colors. Your terminal's theme decides the exact shade of each ANSI color.

## How logmoji uses the codes

Every logmoji line starts with the level's color code and ends with the reset code `\x1b[0m`, so the color never leaks into the next line. The `logColors` option replaces the code for any level you list and keeps the defaults for the rest:

```javascript
const logger = require("logmoji")({
  logColors: { info: "\x1b[36m", error: "\x1b[1;31m" },
});

logger.info("cyan");
logger.error("bold red");
```

A value is accepted when it looks like an ANSI color code: `\x1b[`, one or more numbers separated by `;`, then `m`. Anything else, such as `"blue"` or `"#ff0000"`, silently falls back to the default color for that level. The full option list is on the [configuration page](/config).

## Default colors

| Level | Code | Color |
| --- | --- | --- |
| `success` | `\x1b[32m` | green |
| `fail`, `error` | `\x1b[31m` | red |
| `warn`, `warning` | `\x1b[33m` | yellow |
| `alert` | `\x1b[91m` | bright red |
| `crit` | `\x1b[35m` | magenta |
| `debug` | `\x1b[90m` | dark gray |
| `silly` | `\x1b[2m` | dim |
| `info`, `log` | `\x1b[0m` | terminal default |

## ANSI codes the picker uses

| Codes | Meaning |
| --- | --- |
| `30` to `37` | black, red, green, yellow, blue, magenta, cyan, white |
| `90` to `97` | the bright versions of the same eight colors |
| `1`, `2`, `3`, `4` | bold, dim, italic, underline |
| `0` | reset to the terminal default |

Codes combine with a semicolon, so `\x1b[1;31m` is bold red. The 256-color form `\x1b[38;5;208m` also passes logmoji's check if your terminal supports it.

## Colors in files and pipes

logmoji writes the codes whatever the output is. When you redirect a script to a file, the file contains sequences like `[31m`. To keep a file clean, turn logging off with `LOGMOJI_DISABLE=true`, or log through a library that checks for a terminal. [How to add color to console.log in Node.js](/blog/console-log-colors-node) shows the `isTTY` check, `NO_COLOR` and Node's built-in `util.styleText`.

## Start with logmoji

```bash
npm install logmoji
```

The [usage guide](/usage) lists every log function, and the [blog](/blog/) has more on [log levels](/blog/log-levels-explained) and [emoji logs](/blog/emoji-console-logs).
