---
title: "Node.js Logging Basics for Small Apps"
titleTemplate: false
description: "Node.js logging basics for small apps: stdout and stderr, console methods, timestamps, levels, context labels, an Express access log and when to add a library."
headline: "Logging in Node.js without a framework"
date: "2026-11-28"
keyword: "node.js logging"
faq: [{"q": "Should I use console.log for logging in Node.js?", "a": "For scripts and small apps where a person reads the output, yes, as long as errors go to console.error and lines carry a time and a level. Use a JSON logger when logs are collected and searched."}, {"q": "Where does console.log output go in Node.js?", "a": "console.log, console.info and console.debug write to stdout. console.warn and console.error write to stderr."}]
---

# Logging in Node.js without a framework

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">A small Node.js app does not need much to log well: the right console method, a timestamp, a level and a label that says where the line came from. This post covers those pieces with plain Node.js, then shows the same with logmoji.</p>

## stdout, stderr and the console methods

The global `console` writes to two streams ([Node.js docs](https://nodejs.org/api/console.html)):

| Method | Stream |
| --- | --- |
| `console.log`, `console.info`, `console.debug` | stdout |
| `console.error`, `console.warn` | stderr |

`console.info` and `console.debug` are aliases for `console.log`, and `console.warn` is an alias for `console.error`. Writing problems to stderr lets the shell or a process manager keep them apart:

```bash
node app.js > out.log 2> errors.log
```

The console methods accept format specifiers such as `%s`, `%d`, `%j` and `%o`, and print objects and `Error` instances (with their stack) the way `util.inspect` does.

## Add a timestamp and a level

A line without time and severity is hard to use later. A minimal helper:

```javascript
function log(level, ...args) {
  const out = level === "error" || level === "warn" ? console.error : console.log;
  out(new Date().toISOString(), level.toUpperCase(), ...args);
}

log("info", "server started on port", 3000);
log("error", "db connection failed", err);
```

For the meaning of each level, see [log levels explained](/blog/log-levels-explained). To filter by severity, compare positions in an ordered list, as shown in the [log level hierarchy](/blog/log-level-hierarchy) post.

## Say where the line came from

In an app with several parts, a label such as `Auth` or `HTTP` saves guessing. Pass it explicitly, or create a small logger per module that adds it for you.

## A simple Express access log

Log each request once it finishes, with method, URL, status and time taken:

```javascript
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`);
  });
  next();
});
```

For a standard access log format, the `morgan` middleware does this for Express.

## The same pieces with logmoji

[logmoji](/) bundles these pieces into one factory. Each level already goes to the right console method, `timestamp` adds the time in ISO, locale or Unix format, and `createContext` adds the label:

```javascript
const logger = require("logmoji")({ timestamp: true, dateFormat: "iso", minLevel: "info" });
const http = logger.createContext("HTTP");

http.info("GET /users 200");
http.createContext("GET /users").error("Unauthorized");
```

The nested context prints as `HTTP > GET /users`. In tests, set `LOGMOJI_DISABLE=true` to silence every line. All options are on the [configuration page](/config), and every log function is in the [usage guide](/usage).

## When to move to pino or winston

Plain console output is fine while a person reads the logs. Move to a library such as pino or winston when you need:

- JSON lines that a log platform can search,
- logs written to files with rotation, or sent over HTTP,
- different levels or formats per destination,
- redaction of secrets before anything is written.

The [winston vs pino](/blog/winston-vs-pino) comparison helps pick one.

## FAQ

### Should I use console.log for logging in Node.js?

For scripts and small apps where a person reads the output, yes, as long as errors go to console.error and lines carry a time and a level. Use a JSON logger when logs are collected and searched.

### Where does console.log output go in Node.js?

console.log, console.info and console.debug write to stdout. console.warn and console.error write to stderr.

## Related posts

- [What each log level means and when to use it](/blog/log-levels-explained)
- [How the log level hierarchy filters messages](/blog/log-level-hierarchy)
- [Pino vs winston, and when a console logger is enough](/blog/winston-vs-pino)
- [What console.error does differently from console.log](/blog/console-error)
- [All posts](/blog/)
