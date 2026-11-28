---
title: "pm2 logs: View, Timestamp and Rotate Node.js Logs"
titleTemplate: false
description: "How pm2 logs works: where pm2 keeps out and error files, --lines and --nostream, adding timestamps with --time or log_date_format, flush and log rotation."
headline: "Reading and managing Node.js logs under pm2"
date: "2026-11-28"
keyword: "pm2 logs"
faq: [{"q": "Where does pm2 store logs?", "a": "In $HOME/.pm2/logs by default, one file per stream named after the app: for an app called worker, worker-out.log for stdout and worker-error.log for stderr."}, {"q": "How do I make pm2 logs show a timestamp?", "a": "Start the app with --time, or set log_date_format in the ecosystem file or --log-date-format on the command line, for example YYYY-MM-DD HH:mm:ss."}, {"q": "How do I view pm2 logs without following them?", "a": "pm2 logs worker --lines 50 --nostream prints the last 50 lines of each log file and exits instead of streaming."}]
---

# Reading and managing Node.js logs under pm2

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">pm2 runs Node.js apps in the background and captures everything they print. pm2 logs is how you read it back. This post shows the commands with real output from pm2 7.1.2, running a small app that logs with logmoji, including how to get timestamps on every line.</p>

## The app

A worker that logs once a second, every other line as an error:

```js
const createLogger = require("logmoji");
const log = createLogger();
let n = 0;
log.info("worker started");
setInterval(() => { n++; if (n % 2) log.info("tick", n); else log.error("tick failed", n); }, 1000);
```

```bash
pm2 start loop.js --name worker --time
```

## Where the logs go

The [pm2 log docs](https://pm2.keymetrics.io/docs/usage/log-management/) say log files live in `$HOME/.pm2/logs`. After a few seconds the folder held:

```text
worker-error.log
worker-out.log
```

stdout goes to `-out.log` and stderr to `-error.log`. logmoji's `error` level uses `console.error`, so the failed ticks landed in the error file. The [console.error post](/blog/console-error) explains the split.

## pm2 logs

```text
$ pm2 logs worker --lines 2 --nostream
[TAILING] Tailing last 2 lines for [worker] process (change the value with --lines option)
/root/.pm2/logs/worker-out.log last 2 lines:
0|worker   | 2026-11-28T11:12:56:  [emoji] Info: tick 5
0|worker   | 2026-11-28T11:12:58:  [emoji] Info: tick 7
/root/.pm2/logs/worker-error.log last 2 lines:
0|worker   | 2026-11-28T11:12:57:  [emoji] Error: tick failed 6
0|worker   | 2026-11-28T11:12:59:  [emoji] Error: tick failed 8
```

Output lines are copied from the terminal with logmoji's emoji replaced by `[emoji]`. The `0|worker` prefix is the process id and name.

Options from the docs:

| Option | Effect |
| --- | --- |
| `--lines <n>` | Last n lines instead of the default 15 |
| `--nostream` | Print and exit instead of following |
| `--err` / `--out` | Only one stream |
| `--raw` | Without the id and name prefix |
| `--json` | Each line as JSON |
| `--format` | Formatted output |

Without a name, `pm2 logs` follows every app.

## Timestamps

pm2 adds nothing by default. The same app started without `--time` printed `1|plain    |  [emoji] Info: worker started` with no date. Three ways to add one:

- `--time` on `pm2 start`. The docs call it a standard formatted timestamp; it came out as `2026-11-28T11:12:51:` before each line.
- `--log-date-format "YYYY-MM-DD HH:mm:ss"`, which gave `2026-11-28 11:13:01:`.
- `log_date_format` in the ecosystem file, the same format string.

The alternative is to let the app write its own time. logmoji's `timestamp: true` adds an [ISO timestamp](/blog/toisostring) in brackets. Pick one, not both, or every line carries two dates.

## Ecosystem file

```js
module.exports = {
  apps: [{
    name: "worker",
    script: "loop.js",
    time: true,
    out_file: "/var/log/worker/out.log",
    error_file: "/var/log/worker/error.log",
    merge_logs: true,
  }],
};
```

The docs say `out_file` and `error_file` default to `$HOME/.pm2/logs/<app name>-out.log` and `-error.log`, suffixed with the pm_id unless `merge_logs` is set, and `log_file` writes both streams to one file.

## Flush and rotate

`pm2 flush worker` empties the app's log files. On the test container the out file was 0 bytes right after. For rotation the docs point to a module:

```bash
pm2 install pm2-logrotate
```

or the system's logrotate, set up with `sudo pm2 logrotate -u user`.

## Color codes in the files

The log files are plain files, not terminals, but logmoji 1.3.0 writes its ANSI color codes anyway. The raw error file looked like this, with each escape sequence shown as `<ESC>`:

```text
2026-11-28T11:12:53: <ESC> [emoji] Error: tick failed 2 <ESC>
```

`pm2 logs` strips nothing, so most terminals render them as colors and other tools show them as noise. Set `LOGMOJI_DISABLE=true` in production to drop logmoji output entirely, or use a logger that checks `isTTY` for apps whose logs are kept.

## FAQ

### Where does pm2 store logs?

In $HOME/.pm2/logs by default, one file per stream named after the app: for an app called worker, worker-out.log for stdout and worker-error.log for stderr.

### How do I make pm2 logs show a timestamp?

Start the app with --time, or set log_date_format in the ecosystem file or --log-date-format on the command line, for example YYYY-MM-DD HH:mm:ss.

### How do I view pm2 logs without following them?

pm2 logs worker --lines 50 --nostream prints the last 50 lines of each log file and exits instead of streaming.

## Related posts

- [What console.error does differently from console.log](/blog/console-error)
- [What Date.prototype.toISOString returns, and when it throws](/blog/toisostring)
- [Logging in Node.js without a framework](/blog/nodejs-logging-basics)
- [All posts](/blog/)
