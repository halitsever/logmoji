---
title: "Node.js Logging Guides: Levels, Pino, Winston, Colors"
titleTemplate: false
description: "Guides to logging in Node.js: what log levels mean, how thresholds work, pino and winston set up from their docs, and colored console output by hand."
---

# Node.js logging guides

<p class="lead">Short guides to logging in Node.js, written from the docs of each library and from logmoji's own source. They cover log levels, the two large Node.js loggers, colored console output and the basics a small app needs.</p>

## [What each log level means and when to use it](/blog/log-levels-explained)

Log levels explained: what debug, info, warn, error and fatal mean, the syslog and npm level sets, which level to pick for a message, and a Node.js example.

## [Setting up the pino logger in a Node.js app](/blog/pino-logger)

How to set up the pino logger in Node.js: install, JSON output, log levels and the level option, child loggers, pino-pretty, redaction and NestJS.

## [How to use the winston logger in Node.js](/blog/winston-logger)

How to use the winston logger in Node.js: createLogger, npm and syslog log levels, formats, colorize, the four core transports and child loggers.

## [How the log level hierarchy filters messages](/blog/log-level-hierarchy)

The log level hierarchy from trace to fatal: how severity order works, why syslog and pino number it in opposite directions, and how thresholds filter logs.

## [Pino vs winston, and when a console logger is enough](/blog/winston-vs-pino)

Pino vs winston compared from their own docs: output format, levels, transports, child loggers and dependencies, plus where a small console logger fits.

## [Colorize console.log output in Node.js with ANSI codes](/blog/console-log-colors-node)

How to add color to console.log in Node.js with ANSI escape codes, util.styleText, a TTY check and NO_COLOR, plus how logmoji colors each log level.

## [Logging in Node.js without a framework](/blog/nodejs-logging-basics)

Node.js logging basics for small apps: stdout and stderr, console methods, timestamps, levels, context labels, an Express access log and when to add a library.

## [Readable terminal logs with an emoji per level](/blog/emoji-console-logs)

How emoji logs work in logmoji: an emoji, label and color per level, the defaults, custom symbols, hiding the label and when plain logs are the better choice.
