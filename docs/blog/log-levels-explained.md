---
title: "Log Levels Explained: Debug, Info, Warn, Error"
titleTemplate: false
description: "Log levels explained: what debug, info, warn, error and fatal mean, the syslog and npm level sets, which level to pick for a message, and a Node.js example."
headline: "What each log level means and when to use it"
date: "2026-11-28"
keyword: "log levels"
faq: [{"q": "What are the standard log levels?", "a": "Most loggers use trace, debug, info, warn, error and fatal. The syslog standard, RFC 5424, defines eight: Emergency, Alert, Critical, Error, Warning, Notice, Informational and Debug."}, {"q": "Which log level should production use?", "a": "Both pino and winston default to info, which keeps info, warn and error and drops debug and trace. Lower it to debug only while you investigate a problem."}, {"q": "Is a warning an error?", "a": "No. A warning means something unexpected happened and the program handled it. An error means an operation failed."}]
---

# What each log level means and when to use it

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">A log level is a severity label attached to every log entry. It tells the reader how much the entry matters and lets the program drop entries below a chosen severity. Most loggers use some version of the same five or six names.</p>

## The common levels

The names differ a little between libraries, but most Node.js loggers ship a set close to this one. The meanings below follow how the levels are described in [RFC 5424](https://www.rfc-editor.org/rfc/rfc5424#section-6.2.1) (the syslog standard) and in the pino and winston docs.

| Level | Use it for | Example message |
| --- | --- | --- |
| `trace` | Step-by-step detail, usually only while chasing one bug | entering `parseHeader()` with 3 bytes left |
| `debug` | Values and decisions a developer needs while working on the code | cache miss for key `user:42` |
| `info` | Normal events worth keeping: start-up, shutdown, a finished job | server listening on port 3000 |
| `warn` | Something unexpected that the program handled | config file missing, using defaults |
| `error` | An operation failed and someone may need to act | payment request returned 502 |
| `fatal` | The process cannot continue | database unreachable at start-up, exiting |

A useful test for any message: who reads it, and what do they do next? If the answer is "nobody, unless they are debugging", it is `debug`. If someone should look at it today, it is `error`.

## Three level sets you will meet

**syslog (RFC 5424).** Eight severities, numbered from 0 for the most severe: Emergency, Alert, Critical, Error, Warning, Notice, Informational and Debug. Many server tools and log collectors use these names.

**npm levels (winston's default).** [winston](https://github.com/winstonjs/winston) uses `error`, `warn`, `info`, `http`, `verbose`, `debug` and `silly`, numbered 0 to 6 with 0 the most important. The [winston logger guide](/blog/winston-logger) covers them.

**pino levels.** [pino](https://github.com/pinojs/pino/blob/main/docs/api.md) uses `trace`, `debug`, `info`, `warn`, `error` and `fatal`, with the values 10 to 60, plus `silent`, which turns logging off. Here a higher number means more severe. The [pino logger guide](/blog/pino-logger) shows them in use.

The direction of the numbers is the part that trips people up when they move between tools. The [log level hierarchy](/blog/log-level-hierarchy) post covers ordering and thresholds in detail.

## Which level for which message

- **Start-up and shutdown:** `info`. Include the port, version or mode, so the line answers "what started?"
- **A retry that worked:** `warn` at most. The request succeeded, but a pattern of retries is worth seeing.
- **A retry that gave up:** `error`, with the cause attached.
- **Input from users that fails validation:** usually `info` or `debug`. It is expected behaviour, not a fault in your program. Logging it as `error` hides real errors in noise.
- **Variable dumps:** `debug`, and remove the ones that stop being useful.
- **The process is about to exit because of a fault:** `fatal` (or `crit` in syslog terms).

## A Node.js example

[logmoji](/) is a small console logger for Node.js with 11 levels. Each level prints its own emoji, a label and a color, and goes to a matching console method:

| Console method | logmoji levels |
| --- | --- |
| `console.log` | `silly`, `debug`, `log` |
| `console.info` | `info`, `success` |
| `console.warn` | `warn`, `warning`, `fail` |
| `console.error` | `alert`, `error`, `crit` |

```javascript
const logger = require("logmoji")({ timestamp: true });

logger.info("Server listening on port", 3000);
logger.warn("Config file missing, using defaults");
logger.error("Payment request failed", err);
logger.debug("Cache miss for", key);
```

In Node.js, `console.log` and `console.info` write to stdout, while `console.warn` and `console.error` write to stderr ([Node.js console docs](https://nodejs.org/api/console.html)). That split means `node app.js 2> errors.txt` already separates warnings and errors from the rest.

To hide the lower levels, set `minLevel`. The [usage guide](/usage) lists every log function and the [configuration page](/config) lists all options.

```javascript
const logger = require("logmoji")({ minLevel: "warn" });
logger.info("hidden");
logger.error("shown");
```

## FAQ

### What are the standard log levels?

Most loggers use trace, debug, info, warn, error and fatal. The syslog standard, RFC 5424, defines eight: Emergency, Alert, Critical, Error, Warning, Notice, Informational and Debug.

### Which log level should production use?

Both pino and winston default to info, which keeps info, warn and error and drops debug and trace. Lower it to debug only while you investigate a problem.

### Is a warning an error?

No. A warning means something unexpected happened and the program handled it. An error means an operation failed.

## Related posts

- [Setting up the pino logger in a Node.js app](/blog/pino-logger)
- [How the log level hierarchy filters messages](/blog/log-level-hierarchy)
- [Logging in Node.js without a framework](/blog/nodejs-logging-basics)
- [All posts](/blog/)
