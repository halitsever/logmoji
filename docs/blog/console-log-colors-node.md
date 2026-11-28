---
title: "How to Add Color to console.log in Node.js"
titleTemplate: false
description: "How to add color to console.log in Node.js with ANSI escape codes, util.styleText, a TTY check and NO_COLOR, plus how logmoji colors each log level."
headline: "Colorize console.log output in Node.js with ANSI codes"
date: "2026-11-28"
keyword: "add color to console.log"
faq: [{"q": "How do I change the color of console.log in Node.js?", "a": "Put an ANSI escape code such as \\x1b[31m before the text and \\x1b[0m after it, or wrap the text with util.styleText('red', text) from node:util."}, {"q": "Why do my log files contain strange characters like [31m?", "a": "Those are ANSI color codes written while output was not a terminal. Check process.stdout.isTTY before adding them, or use util.styleText, which does that check for you."}, {"q": "Does %c work in Node.js?", "a": "No. Node.js accepts the %c specifier but ignores the CSS. It only styles output in browser consoles."}]
---

# Colorize console.log output in Node.js with ANSI codes

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Terminals color text when they receive ANSI escape codes: a short sequence that starts with the escape character and ends with m. Node.js can write them by hand, or build them for you with util.styleText. Either way, turn color off when the output is not a terminal.</p>

## ANSI escape codes by hand

A color code is `\x1b[`, a number, and `m`. Write one before the text and the reset code `\x1b[0m` after it, or everything printed later stays colored.

```javascript
console.log("\x1b[31m%s\x1b[0m", "This line is red");
console.log("\x1b[1;32mBold green\x1b[0m and back to normal");
```

Codes can be combined with a semicolon: `1;32` is bold and green. The ones you will use most:

| Code | Effect | Code | Effect |
| --- | --- | --- | --- |
| `0` | reset | `1` | bold |
| `2` | dim | `3` | italic |
| `4` | underline | `7` | inverse |
| `30` | black | `90` | bright black (gray) |
| `31` | red | `91` | bright red |
| `32` | green | `92` | bright green |
| `33` | yellow | `93` | bright yellow |
| `34` | blue | `94` | bright blue |
| `35` | magenta | `95` | bright magenta |
| `36` | cyan | `96` | bright cyan |
| `37` | white | `97` | bright white |

Background colors use 40 to 47 and 100 to 107. Most terminals also accept `38;5;n` for one of 256 colors. Support for italic and the 256-color form depends on the terminal.

## The built-in way: util.styleText

Node.js has [util.styleText](https://nodejs.org/api/util.html#utilstyletextformat-text-options), added in v20.12.0 and v21.7.0 and marked stable in v22.13.0 and v23.5.0. It takes a format name, or an array of them, and returns the colored string:

```javascript
const { styleText } = require("node:util");

console.log(styleText("green", "Success!"));
console.log(styleText(["bold", "red"], "Error!"));
console.error(styleText("yellow", "Warning", { stream: process.stderr }));
```

Since v22.8.0 and v20.18.0 it checks whether the stream is a terminal and respects the `NO_COLOR`, `NODE_DISABLE_COLORS` and `FORCE_COLOR` environment variables, so colors disappear on their own when you pipe output to a file. Newer releases (v24.16.0, v26.1.0) also accept hex colors such as `#ff8800`. The names it accepts are listed in `util.inspect.colors`.

## Turn colors off when nobody sees them

Hand-written codes are always written, even into a log file. A simple guard:

```javascript
const useColor = process.stdout.isTTY && !("NO_COLOR" in process.env);
const red = (s) => (useColor ? `\x1b[31m${s}\x1b[0m` : s);

console.log(red("failed"));
```

`process.stdout.isTTY` is `true` only when stdout is a terminal. [NO_COLOR](https://no-color.org) is a convention many command-line tools follow: when the variable is set, print no color. Node.js itself treats `FORCE_COLOR` as the override in the other direction.

## What about %c?

Browsers style `console.log("%cText", "color: red")` with CSS. Node.js does not: its formatter accepts `%c` but ignores the CSS. Use ANSI codes or `styleText` in Node.js.

## Colors per log level with logmoji

[logmoji](/) colors every line by its level: green for `success`, red for `error` and `fail`, yellow for `warn` and `warning`, and so on. Change any of them with `logColors`, using the same ANSI codes as above:

```javascript
const logger = require("logmoji")({
  logColors: { info: "\x1b[36m", error: "\x1b[1;31m" },
});

logger.info("cyan line");
logger.error("bold red line");
```

Values must match the pattern of a color code (`\x1b[` digits, optional `;digits`, then `m`); anything else falls back to the default color. logmoji writes the reset code after every line. It does not check `isTTY` or `NO_COLOR`, so the codes also reach files and pipes. The defaults are listed on the [configuration page](/config).

To pick codes without memorising the table, use the [console log colors picker](/console-log-colors/): choose a color for each level, see the preview and copy the `logColors` object.

## FAQ

### How do I change the color of console.log in Node.js?

Put an ANSI escape code such as \x1b[31m before the text and \x1b[0m after it, or wrap the text with util.styleText('red', text) from node:util.

### Why do my log files contain strange characters like [31m?

Those are ANSI color codes written while output was not a terminal. Check process.stdout.isTTY before adding them, or use util.styleText, which does that check for you.

### Does %c work in Node.js?

No. Node.js accepts the %c specifier but ignores the CSS. It only styles output in browser consoles.

## Related posts

- [What each log level means and when to use it](/blog/log-levels-explained)
- [Logging in Node.js without a framework](/blog/nodejs-logging-basics)
- [Readable terminal logs with an emoji per level](/blog/emoji-console-logs)
- [What console.error does differently from console.log](/blog/console-error)
- [All posts](/blog/)
