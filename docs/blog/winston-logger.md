---
title: "Winston Logger: Setup, Levels and Transports"
titleTemplate: false
description: "How to use the winston logger in Node.js: createLogger, npm and syslog log levels, formats, colorize, the four core transports and child loggers."
headline: "How to use the winston logger in Node.js"
date: "2026-11-28"
keyword: "winston logger"
faq: [{"q": "What are the default winston logger levels?", "a": "The npm levels: error 0, warn 1, info 2, http 3, verbose 4, debug 5 and silly 6. Lower numbers are more important."}, {"q": "How do I log to a file and the console with winston?", "a": "Pass two transports to createLogger: new winston.transports.File({ filename: 'combined.log' }) and new winston.transports.Console(). Each can have its own level and format."}]
---

# How to use the winston logger in Node.js

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Winston is a Node.js logger built around transports: one logger can send the same entry to the console, a file and an HTTP endpoint, each with its own level and format. This guide follows winston's README and transport docs (winston 3.19.0 was current on npm when it was written).</p>

## Install and create a logger

```bash
npm install winston
```

winston's README recommends creating your own logger with `createLogger`:

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

logger.info("Hello again distributed logs");
```

The options that matter most, with their defaults from the README:

| Option | Default | What it does |
| --- | --- | --- |
| `level` | `'info'` | Logs an entry only if its level is at or above this severity |
| `levels` | `winston.config.npm.levels` | The level names and their priorities |
| `format` | `winston.format.json` | How each entry is turned into text |
| `transports` | `[]` | Where entries go |
| `exitOnError` | `true` | If false, handled exceptions do not call `process.exit` |
| `silent` | `false` | If true, all logs are suppressed |

## Winston logger levels

winston's levels follow the ordering in RFC 5424: the lower the number, the more important the entry. Unless you pass `levels`, winston uses the npm set:

```javascript
{ error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
```

`winston.config.syslog.levels` gives the eight syslog names (`emerg` to `debug`). Each level becomes a method on the logger, so `logger.warn()` and `logger.log("warn", ...)` do the same thing. The [log levels explained](/blog/log-levels-explained) post covers what each one is for.

## Formats and colors

Formats come from the `logform` package and are combined with `winston.format.combine`. To color the level name in the console:

```javascript
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [new transports.Console()],
});
```

`colorize()` must come before any format that adds text you want colored. Custom levels need `winston.addColors()` with color names such as `blue`, `bold red` or `cyanBG`. To color text yourself without a library, see [how to add color to console.log](/blog/console-log-colors-node).

## Transports

winston ships four core transports:

- **Console**: writes to stdout and stderr. `stderrLevels` picks the levels that go to stderr.
- **File**: writes to a file, with `maxsize`, `maxFiles` and `zippedArchive` for size-based rolling. For daily rotation the docs point to `winston-daily-rotate-file`.
- **Http**: sends entries to an HTTP endpoint, with optional batching.
- **Stream**: writes to any Node.js stream.

Each transport accepts its own `level` and `format`, so the console can show `info` while a file keeps only `error`. Community transports cover databases and hosted log services.

## Child loggers

`logger.child({ requestId: "451" })` returns a logger that adds those fields to every entry. The README warns that `.child` may misbehave if you also extend the `Logger` class.

## Exceptions and rejections

`exceptionHandlers` and `rejectionHandlers` take transports that log uncaught exceptions and unhandled promise rejections. By default winston exits after logging an uncaught exception; set `exitOnError: false` to keep the process running.

## When winston is more than you need

Winston pays off when entries go to several places in different formats. For a script that only prints to the terminal, a plain console logger such as [logmoji](/) does less and needs no setup beyond `require("logmoji")()`. The [winston vs pino](/blog/winston-vs-pino) post compares the three.

## FAQ

### What are the default winston logger levels?

The npm levels: error 0, warn 1, info 2, http 3, verbose 4, debug 5 and silly 6. Lower numbers are more important.

### How do I log to a file and the console with winston?

Pass two transports to createLogger: new winston.transports.File({ filename: 'combined.log' }) and new winston.transports.Console(). Each can have its own level and format.

## Related posts

- [What each log level means and when to use it](/blog/log-levels-explained)
- [Setting up the pino logger in a Node.js app](/blog/pino-logger)
- [Pino vs winston, and when a console logger is enough](/blog/winston-vs-pino)
- [All posts](/blog/)
