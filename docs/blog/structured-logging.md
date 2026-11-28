---
title: "Structured Logging in Node.js: JSON Logs Explained"
titleTemplate: false
description: "What structured logging means, what a JSON log line looks like in pino and winston, which fields to include, and when plain text console logs are enough."
headline: "Structured logs: why logs became JSON, with Node.js output"
date: "2026-11-28"
keyword: "structured logging"
faq: [{"q": "What is structured logging?", "a": "Writing each log entry as a record with named fields, such as level, time, message and request id, in a machine-readable format like JSON. Log tools can then filter and aggregate on fields instead of searching text."}, {"q": "Is pino structured logging?", "a": "Yes. pino writes one JSON object per line by default, with numeric level, time in milliseconds, pid, hostname and msg, plus any fields you pass."}, {"q": "Is logmoji a structured logger?", "a": "No. logmoji formats a colored line with an emoji, a label and the message for a person reading a terminal. For logs that a machine collects, use pino or winston with JSON output."}]
---

# Structured logs: why logs became JSON, with Node.js output

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">A structured log line is a record with named fields, usually one JSON object per line, instead of a sentence for a person to read. This post shows real output from pino and winston, the fields worth including, and where a human-readable logger such as logmoji fits instead.</p>

## Text logs vs structured logs

A text log line is written for a person:

```text
[2026-11-28T11:11:23.673Z] [emoji] Info: user 42 logged in from /login
```

To find every login by user 42 in a million such lines, you write a regex and hope the wording never changed. A structured line carries the same facts as fields:

```json
{"level":30,"time":1795864302066,"pid":2381011,"hostname":"rdp-server","userId":42,"route":"/login","msg":"user logged in"}
```

Now `userId = 42` is a query, not a guess. That line is real output from [pino](https://getpino.io/) 10.4.0.

## pino

```js
const logger = require("pino")();
logger.info({ userId: 42, route: "/login" }, "user logged in");
logger.error({ err: new Error("connection refused") }, "db failed");
logger.child({ requestId: "req-7" }).warn("slow response");
```

```json
{"level":30,"time":1795864302066,"pid":2381011,"hostname":"rdp-server","userId":42,"route":"/login","msg":"user logged in"}
{"level":50,"time":1795864302068,"pid":2381011,"hostname":"rdp-server","err":{"type":"Error","message":"connection refused","stack":"Error: connection refused\n    at ..."},"msg":"db failed"}
{"level":40,"time":1795864302070,"pid":2381011,"hostname":"rdp-server","requestId":"req-7","msg":"slow response"}
```

Three details: levels are numbers (30 info, 40 warn, 50 error), `time` is epoch milliseconds, and an `err` field is serialized with its type, message and stack. The child logger adds `requestId` to every line without repeating it. The [pino post](/blog/pino-logger) covers setup.

## winston

[winston](https://github.com/winstonjs/winston) writes JSON when you choose the `json` format:

```js
const winston = require("winston");
const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});
logger.info("user logged in", { userId: 42, route: "/login" });
```

```json
{"level":"info","message":"user logged in","route":"/login","timestamp":"2026-11-28T11:11:42.516Z","userId":42}
```

Here the level is a string and the timestamp an ISO string from `toISOString()`. Neither shape is more correct; pick one and keep it across services. More in the [winston post](/blog/winston-logger).

## Fields worth having

- **Time** in UTC, as epoch milliseconds or an [ISO string](/blog/toisostring).
- **Level**, so you can filter errors.
- **Message**, a short constant string such as `user logged in`. Put the changing parts in fields, not in the message, so identical events group together.
- **Context**: request id, user id, job name, whatever ties lines from one operation together. Child loggers make this cheap.
- **Error details** as fields, including the stack.

Leave out secrets. pino has a `redact` option for paths such as `req.headers.authorization`.

## One object per line

Both libraries write newline-delimited JSON: one complete object per line. That lets a collector read the stream line by line, and lets you search a file with ordinary tools:

```bash
node app.js | grep '"level":50'
```

In development, pino's `pino-pretty` turns the same stream back into readable text, so you do not have to pick between people and machines.

## When text is fine

Structured logs pay off when something other than a person reads them: a log service, a dashboard, an alert. For a CLI tool, a build script or local debugging, a readable line is what you want.

That is the job logmoji does. It formats a line for a terminal, with a color, an emoji, a level label and an optional context, and passes it to `console.info`, `console.warn` or `console.error` ([src/index.js](https://github.com/halitsever/logmoji/blob/main/src/index.js)). It does not produce JSON and is not meant to feed a log pipeline. It also writes its color codes even when the output is a file or a pipe, which makes its output harder to parse later, as the [pm2 logs post](/blog/pm2-logs) shows. Use it where a person watches the output and pino or winston where a machine collects it.

## FAQ

### What is structured logging?

Writing each log entry as a record with named fields, such as level, time, message and request id, in a machine-readable format like JSON. Log tools can then filter and aggregate on fields instead of searching text.

### Is pino structured logging?

Yes. pino writes one JSON object per line by default, with numeric level, time in milliseconds, pid, hostname and msg, plus any fields you pass.

### Is logmoji a structured logger?

No. logmoji formats a colored line with an emoji, a label and the message for a person reading a terminal. For logs that a machine collects, use pino or winston with JSON output.

## Related posts

- [Setting up the pino logger in a Node.js app](/blog/pino-logger)
- [How to use the winston logger in Node.js](/blog/winston-logger)
- [What Date.prototype.toISOString returns, and when it throws](/blog/toisostring)
- [All posts](/blog/)
