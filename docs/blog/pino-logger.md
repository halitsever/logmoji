---
title: "Pino Logger in Node.js: Setup and Log Levels"
titleTemplate: false
description: "How to set up the pino logger in Node.js: install, JSON output, log levels and the level option, child loggers, pino-pretty, redaction and NestJS."
headline: "Setting up the pino logger in a Node.js app"
date: "2026-11-28"
keyword: "pino logger"
faq: [{"q": "What is the default level in pino?", "a": "info. Calls to trace and debug write nothing until you set level to debug or trace."}, {"q": "How do I make pino output readable?", "a": "Install pino-pretty and set transport: { target: 'pino-pretty' } while developing. Keep JSON output in production."}]
---

# Setting up the pino logger in a Node.js app

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Pino is a JSON logger for Node.js. Every call writes one line of newline-delimited JSON, which suits log collectors and long-term storage. This guide follows pino's own API docs (pino 10.4.0 was the current version on npm when it was written).</p>

## Install and log a line

```bash
npm install pino
```

```javascript
const logger = require("pino")();

logger.info("hello world");
```

The output is one JSON object per line. pino's README shows this shape:

```json
{"level":30,"time":1531171074631,"msg":"hello world","pid":657,"hostname":"Davids-MBP-3.fritz.box"}
```

`level` is a number, `time` is a Unix timestamp in milliseconds, and `pid` and `hostname` are added to every line by default.

## Pino log levels

From the [pino API docs](https://github.com/pinojs/pino/blob/main/docs/api.md):

| Level | trace | debug | info | warn | error | fatal | silent |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Value | 10 | 20 | 30 | 40 | 50 | 60 | Infinity |

The `level` option sets the minimum. It defaults to `info`, so `trace` and `debug` calls do nothing until you lower it. `silent` turns logging off.

```javascript
const logger = require("pino")({ level: process.env.LOG_LEVEL || "info" });

if (logger.isLevelEnabled("debug")) logger.debug({ query }, "running query");
```

You can change the level at run time by assigning `logger.level = "debug"`. Extra levels come from the `customLevels` option, for example `customLevels: { audit: 35 }`, which adds a `logger.audit()` method between `info` and `warn`. The [log level hierarchy](/blog/log-level-hierarchy) post explains how these thresholds compare with winston's.

## Objects and messages

Pass an object first to merge its fields into the JSON line, then the message:

```javascript
logger.info({ userId: 42, route: "/login" }, "user signed in");
```

## Child loggers

`logger.child(bindings)` returns a logger that adds the same fields to every line. A child uses the parent's output stream and starts with the parent's level.

```javascript
const reqLogger = logger.child({ requestId: "a1b2" });
reqLogger.info("request received");
```

## Readable output while developing

JSON is hard to scan in a terminal. pino's docs suggest [pino-pretty](https://github.com/pinojs/pino-pretty), installed as a separate package and loaded as a transport:

```bash
npm install pino-pretty
```

```javascript
const logger = require("pino")({
  transport: { target: "pino-pretty", options: { colorize: true } },
});
```

Keep raw JSON in production, where something else reads the logs.

## Transports

In pino a transport is a module that receives log lines and sends or reshapes them. Since pino 7, transports set up with `pino.transport()` run in a worker thread, so the main thread only writes lines. With `targets`, each destination gets its own minimum level:

```javascript
const transport = pino.transport({
  targets: [
    { target: "pino/file", options: { destination: "./app.log" }, level: "info" },
    { target: "pino-pretty", level: "debug" },
  ],
});
const logger = pino({ level: "debug" }, transport);
```

## Redacting secrets

The `redact` option takes paths whose values are replaced with `[Redacted]` before the line is written:

```javascript
const logger = require("pino")({ redact: ["req.headers.authorization", "password"] });
```

## Pino in NestJS

pino's docs point NestJS apps to the `nestjs-pino` package: install it, add `LoggerModule.forRoot()` to the module's imports and inject its `Logger`. See [nestjs-pino](https://github.com/iamolegga/nestjs-pino) for the options.

## When a console logger is enough

Pino is built for services whose logs are collected and searched later. For a CLI tool, a bot or a build script where a person reads the terminal directly, readable lines can matter more than JSON. That is the job [logmoji](/) does: each line gets a color, an emoji and a level label, and it goes straight to the console methods. The [comparison post](/blog/winston-vs-pino) puts pino, winston and logmoji side by side.

## FAQ

### What is the default level in pino?

info. Calls to trace and debug write nothing until you set level to debug or trace.

### How do I make pino output readable?

Install pino-pretty and set transport: { target: 'pino-pretty' } while developing. Keep JSON output in production.

## Related posts

- [How to use the winston logger in Node.js](/blog/winston-logger)
- [How the log level hierarchy filters messages](/blog/log-level-hierarchy)
- [Pino vs winston, and when a console logger is enough](/blog/winston-vs-pino)
- [All posts](/blog/)
