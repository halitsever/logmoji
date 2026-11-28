---
title: "Log Level Hierarchy: From Trace to Fatal"
titleTemplate: false
description: "The log level hierarchy from trace to fatal: how severity order works, why syslog and pino number it in opposite directions, and how thresholds filter logs."
headline: "How the log level hierarchy filters messages"
date: "2026-11-28"
keyword: "log level hierarchy"
faq: [{"q": "What is the log level hierarchy?", "a": "An ordering of levels from least to most severe, usually trace, debug, info, warn, error, fatal. A threshold keeps its own level and everything more severe."}, {"q": "Is a lower log level number more severe?", "a": "In syslog and winston, yes: 0 is the most severe. In pino it is the other way round: fatal is 60 and trace is 10."}]
---

# How the log level hierarchy filters messages

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Log levels form an ordered list. Setting a threshold keeps every entry at that level or more severe and drops the rest. The idea is the same everywhere, but libraries number the list in different directions.</p>

## The order, least to most severe

```text
trace < debug < info < warn < error < fatal
```

A threshold of `info` keeps `info`, `warn`, `error` and `fatal`, and drops `debug` and `trace`. This is what pino's `level`, winston's `level` and logmoji's `minLevel` all do. The [log levels explained](/blog/log-levels-explained) post covers what belongs at each level; this one is about the ordering.

## Two numbering directions

| Scheme | Most severe | Least severe | Higher number means |
| --- | --- | --- | --- |
| syslog, [RFC 5424](https://www.rfc-editor.org/rfc/rfc5424#section-6.2.1) | 0 Emergency | 7 Debug | less severe |
| winston npm levels | 0 error | 6 silly | less severe |
| pino | 60 fatal | 10 trace | more severe |

The RFC 5424 severities, in full:

| Code | Severity |
| --- | --- |
| 0 | Emergency: system is unusable |
| 1 | Alert: action must be taken immediately |
| 2 | Critical: critical conditions |
| 3 | Error: error conditions |
| 4 | Warning: warning conditions |
| 5 | Notice: normal but significant condition |
| 6 | Informational: informational messages |
| 7 | Debug: debug-level messages |

So "level 3" means an error in syslog and winston's syslog set, and nothing at all in pino, where an error is 50. When you map levels between tools, map by name.

## How each library applies the threshold

**pino.** The `level` option is a minimum: methods below it become no-ops. With `level: "info"` (the default), `trace` (10) and `debug` (20) write nothing. Transports set up with `targets` can each take their own `level`.

**winston.** The logger's `level` keeps entries whose priority number is less than or equal to the threshold's. Each transport can also have a `level`, so the console and a file can filter differently.

**logmoji.** `minLevel` uses this order, from logmoji's source:

```text
silly < debug < log < info < success < warn < warning < fail < alert < error < crit
```

```javascript
const logger = require("logmoji")({ minLevel: "warn" });

logger.success("hidden"); // below warn
logger.warning("shown");  // above warn
logger.crit("shown");
```

logmoji also has `levels`, an allowlist that ignores the order: `levels: ["debug", "error"]` prints only those two. If both are set, `levels` wins. Details are on the [configuration page](/config).

## Thresholds from the environment

A common pattern is to read the threshold from an environment variable, so the same build can be quieter in production:

```javascript
const logger = require("logmoji")({ minLevel: process.env.LOG_LEVEL || "info" });
```

Check the value you pass. In logmoji, a `minLevel` that is not one of the 11 names turns filtering off and every level prints. pino rejects an unknown level name when the logger is created.

## Writing your own threshold check

If you roll your own logger, store the order once and compare positions:

```javascript
const ORDER = ["trace", "debug", "info", "warn", "error", "fatal"];
const min = ORDER.indexOf(process.env.LOG_LEVEL || "info");

function log(level, ...args) {
  if (ORDER.indexOf(level) < min) return;
  const out = ORDER.indexOf(level) >= ORDER.indexOf("warn") ? console.error : console.log;
  out(`[${level}]`, ...args);
}
```

The [Node.js logging basics](/blog/nodejs-logging-basics) post builds on this with timestamps and context labels.

## FAQ

### What is the log level hierarchy?

An ordering of levels from least to most severe, usually trace, debug, info, warn, error, fatal. A threshold keeps its own level and everything more severe.

### Is a lower log level number more severe?

In syslog and winston, yes: 0 is the most severe. In pino it is the other way round: fatal is 60 and trace is 10.

## Related posts

- [What each log level means and when to use it](/blog/log-levels-explained)
- [Setting up the pino logger in a Node.js app](/blog/pino-logger)
- [How to use the winston logger in Node.js](/blog/winston-logger)
- [Turning debug output on and off with the debug package](/blog/debug-npm)
- [All posts](/blog/)
