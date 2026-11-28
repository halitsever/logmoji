---
title: "Emoji Logs: Readable Debug Output in the Terminal"
titleTemplate: false
description: "How emoji logs work in logmoji: an emoji, label and color per level, the defaults, custom symbols, hiding the label and when plain logs are the better choice."
headline: "Readable terminal logs with an emoji per level"
date: "2026-11-28"
keyword: "emoji logs"
---

# Readable terminal logs with an emoji per level

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">When a terminal scrolls fast, color and shape are easier to spot than words. logmoji gives every log level its own emoji, label and color, so a failure stands out without reading each line.</p>

## What a line looks like

Each logmoji line is built in this order, from `src/index.js`:

1. the level's ANSI color code,
2. the timestamp, if `timestamp` is on,
3. the level's emoji,
4. the label, such as `Info:`, unless `disablePrefixText` is on,
5. the context label from `createContext`, if any,
6. your arguments, passed to the console unchanged,
7. the reset code `\x1b[0m`.

```javascript
const logger = require("logmoji")({ timestamp: true });

logger.success("Build finished");
logger.error("Upload failed", err);
```

## The default emojis

These are the default symbols, copied from the [configuration page](/config):

```javascript
{
  success: "✅", fail: "📛",   warn: "🟠",  error: "🚨",
  info:    "📄", log:  "📄",   alert: "😡", crit:  "😱",
  warning: "⚠️", debug: "🛠️", silly: "🤪",
}
```

`info` and `log` share a symbol. `warn` and `warning` both go to `console.warn` but use different symbols, and in the `minLevel` order `warning` sits one step above `warn`.

## Use your own symbols

Override any level with `logSymbols`. A value passes if it contains a character with the Unicode `Emoji` property; anything else falls back to the default.

```javascript
const logger = require("logmoji")({
  logSymbols: { success: "🚀", debug: "🔍" },
});
```

Note that the `Emoji` property also covers the digits 0 to 9, `#` and `*`, so `"1"` is accepted as a symbol.

## Emoji only, no label

`disablePrefixText: true` drops the `Info:` style label and leaves the emoji, the context and your message. That is the shortest line logmoji prints.

```javascript
const logger = require("logmoji")({ disablePrefixText: true });
```

## Pair the emoji with color

Each level also has a color, changed with `logColors`. The [console log colors picker](/console-log-colors/) previews all 11 levels and writes the config for you, and [how to add color to console.log](/blog/console-log-colors-node) explains the codes behind it.

## When plain logs are better

Emoji and color codes are for people. Leave them out when:

- a program parses the output, such as a log platform that expects JSON. Use a JSON logger like pino or winston there, compared in [winston vs pino](/blog/winston-vs-pino);
- the terminal or its font cannot draw emoji, which shows up as empty boxes;
- the output goes to a file, because logmoji writes the color codes there too.

To turn logmoji off entirely, for example in tests or production, set `LOGMOJI_DISABLE=true`. Install it with `npm install logmoji` and start from the [usage guide](/usage).

## Related posts

- [Pino vs winston, and when a console logger is enough](/blog/winston-vs-pino)
- [Colorize console.log output in Node.js with ANSI codes](/blog/console-log-colors-node)
- [Logging in Node.js without a framework](/blog/nodejs-logging-basics)
- [All posts](/blog/)
