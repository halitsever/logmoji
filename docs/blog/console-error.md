---
title: "console.error vs console.log: stderr in Node.js"
titleTemplate: false
description: "What console.error does in Node.js and the browser: stderr vs stdout, format strings, Error objects, redirecting with 2> and 2>&1, and logmoji's error levels."
headline: "What console.error does differently from console.log"
date: "2026-11-28"
keyword: "console.error"
faq: [{"q": "What is the difference between console.log and console.error?", "a": "In Node.js, console.log prints to stdout and console.error prints to stderr. The text is formatted the same way. In browsers both go to the developer console, and console.error is shown as an error."}, {"q": "Is console.warn the same as console.error?", "a": "In Node.js, yes for the output stream: the docs call console.warn an alias for console.error, so both write to stderr."}, {"q": "How do I save console.error output to a file?", "a": "Redirect stderr in the shell: node app.js 2> errors.log. Use 2>&1 to send stderr to the same place as stdout, for example node app.js > all.log 2>&1."}]
---

# What console.error does differently from console.log

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">console.error looks like console.log with a red tint, but in Node.js the difference is where the text goes. console.log writes to standard output and console.error to standard error, two separate streams the shell can send to different places. This post shows what that means in practice, with real output from a logmoji script.</p>

## Two streams

The [Node.js console docs](https://nodejs.org/api/console.html) say `console.log` prints to `stdout` with a newline and `console.error` prints to `stderr` with a newline. `console.info` is an alias for `console.log`, and `console.warn` an alias for `console.error`.

Both take the same arguments: a first string with optional `%s`, `%d`, `%o` placeholders, then values. Arguments without a placeholder go through `util.inspect()`, so an `Error` prints with its stack:

```js
console.error("failed after %d retries", 3);
console.error(new Error("connection refused")); // message and stack trace
```

## Why it matters: the shell can split them

A program has one stdout and one stderr. A terminal shows both, so they look the same while you watch. Redirect them and they separate.

This script uses logmoji, which sends info and success to `console.info` and warn and error to `console.warn` and `console.error` ([src/index.js](https://github.com/halitsever/logmoji/blob/main/src/index.js)):

```js
const createLogger = require("logmoji");
const log = createLogger({ timestamp: true });
log.info("server started on port 3000");
log.warn("cache miss rate is high");
log.error("database connection refused");
log.success("migration finished");
```

```bash
node app.js > out.log 2> err.log
```

`out.log` got two lines, `err.log` the other two:

```text
out.log  [2026-11-28T11:11:23.673Z] [emoji] Info: server started on port 3000
         [2026-11-28T11:11:23.705Z] [emoji] Success: migration finished
err.log  [2026-11-28T11:11:23.704Z] [emoji] Warn: cache miss rate is high
         [2026-11-28T11:11:23.705Z] [emoji] Error: database connection refused
```

Output lines are copied from the terminal with logmoji's emoji replaced by `[emoji]`.

Common redirections:

| Command | Effect |
| --- | --- |
| `node app.js 2> err.log` | Errors to a file, the rest on screen |
| `node app.js > all.log 2>&1` | Both streams into one file |
| `node app.js 2>/dev/null` | Hide errors |
| `node app.js 2>&1 \| grep refused` | Search both streams |

With `2>/dev/null` the example printed only the info and success lines. Process managers use the same split: [pm2 keeps one file per stream](/blog/pm2-logs).

## Exit codes are separate

Writing to stderr does not make a program fail. A script that calls `console.error` and ends normally still exits with code 0. Set `process.exitCode = 1` or throw when the error should stop a CI job or a shell `&&` chain.

## In the browser

Browsers have no stderr. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/console/error_static) describes `console.error()` as outputting a message at the error log level to the console. DevTools shows it with an error style, counts it among errors and lets you filter by level. Format strings work there too, plus `%c` for CSS, which Node.js ignores.

## Color codes in files

One logmoji detail shows up the moment you redirect. Each line starts with an ANSI color code and ends with a reset code, whether or not the output is a terminal. In `err.log` above, `cat -v` shows them:

```text
^[[33m[2026-11-28T11:11:23.704Z] ... Warn: cache miss rate is high ^[[0m
```

logmoji does not check `process.stderr.isTTY` and does not read `NO_COLOR`, so files and pipes get the codes too. If that matters, set `LOGMOJI_DISABLE=true` for runs that write to files, or use a logger that checks the stream. The [console log colors post](/blog/console-log-colors-node) shows the TTY check.

## When to use which

- `console.error` and `console.warn` for problems, so they can be separated from normal output.
- `console.log` and `console.info` for progress and results, especially when stdout is piped into another program.
- A [log level](/blog/log-levels-explained) system on top when you need to hide debug lines in production.

## FAQ

### What is the difference between console.log and console.error?

In Node.js, console.log prints to stdout and console.error prints to stderr. The text is formatted the same way. In browsers both go to the developer console, and console.error is shown as an error.

### Is console.warn the same as console.error?

In Node.js, yes for the output stream: the docs call console.warn an alias for console.error, so both write to stderr.

### How do I save console.error output to a file?

Redirect stderr in the shell: node app.js 2> errors.log. Use 2>&1 to send stderr to the same place as stdout, for example node app.js > all.log 2>&1.

## Related posts

- [Logging in Node.js without a framework](/blog/nodejs-logging-basics)
- [Printing nested objects in full with console.dir](/blog/console-dir)
- [What each log level means and when to use it](/blog/log-levels-explained)
- [All posts](/blog/)
