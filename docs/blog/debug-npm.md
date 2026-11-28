---
title: "The debug npm Package: DEBUG=app:* Explained"
titleTemplate: false
description: "How the debug npm package works: namespaces, the DEBUG variable, wildcards and exclusions, stderr output, TTY timestamps, %o formatting and DEBUG_COLORS."
headline: "Turning debug output on and off with the debug package"
date: "2026-11-28"
keyword: "npm debug"
faq: [{"q": "How do I turn on debug output in Node.js?", "a": "Set the DEBUG environment variable to the namespaces you want, for example DEBUG=app:* node app.js. Without DEBUG, debuggers created with the debug package print nothing."}, {"q": "How do I exclude one namespace in DEBUG?", "a": "Prefix it with a minus sign: DEBUG=app:*,-app:db prints every app namespace except app:db."}, {"q": "Does debug write to stdout or stderr?", "a": "stderr, by default. The README shows how to send one namespace to stdout by setting its log method to console.log.bind(console)."}]
---

# Turning debug output on and off with the debug package

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">debug is a tiny npm package that prints nothing until you ask for it. Each module gets a named debugger, and the DEBUG environment variable decides which names print. Express and many other packages use it. This post walks through the switches with real output from debug 4.4.3.</p>

## Namespaces

```js
const debugHttp = require("debug")("app:http");
const debugDb = require("debug")("app:db");

debugHttp("GET %s", "/login");
debugDb("query took %dms", 12);
debugDb("row %o", { id: 1, tags: ["a", "b"] });
```

Run it plainly and nothing appears. That is the point of the package ([debug README](https://github.com/debug-js/debug)): debug lines stay in the code and cost nothing visible until someone turns them on.

## The DEBUG variable

```text
$ DEBUG='app:*' node d.js
2026-11-28T11:11:43.146Z app:http GET /login
2026-11-28T11:11:43.149Z app:db query took 12ms
2026-11-28T11:11:43.153Z app:db row { id: 1, tags: [ 'a', 'b' ] }

$ DEBUG='app:*,-app:db' node d.js
2026-11-28T11:11:43.451Z app:http GET /login
```

- Names are separated by commas or spaces.
- `*` is a wildcard, so `app:*` matches every namespace starting with `app:`.
- A leading `-` excludes a namespace.
- `DEBUG=*` turns on every debugger in your app and its dependencies, which for an Express app is a lot.

## Terminal and file output differ

The output above went through a pipe. In a real terminal the same command prints colored names and a time difference instead of a date:

```text
  app:http GET /login +0ms
  app:db query took 12ms +0ms
```

The README says colors are enabled when stderr is a TTY, and that the ISO date from `Date#toISOString()` is used when output is not a TTY, which suits log files. `DEBUG_HIDE_DATE` drops the date.

## stderr by default

```text
$ DEBUG='app:*' node d.js 2>/dev/null | wc -l
0
```

Everything went to stderr. To send one namespace to stdout, the README overrides its `log` method:

```js
const log = require("debug")("app:log");
log.log = console.log.bind(console);
```

## Formatters and other variables

| Formatter | Output |
| --- | --- |
| `%O` | Object, pretty-printed on several lines |
| `%o` | Object, on one line |
| `%s` | String |
| `%d` | Number |
| `%j` | JSON |
| `%%` | A percent sign |

Environment variables the README lists include `DEBUG_COLORS` (`DEBUG_COLORS=no` gave the plain output above; the README suggests `DEBUG_COLORS=1` for a child process whose stderr is piped, where colors would otherwise be off), `DEBUG_DEPTH` for object depth and `DEBUG_SHOW_HIDDEN` for non-enumerable properties.

## Turning it on from code

```js
const debug = require("debug");
debug.enable("app:*");
debug.enabled("app:db"); // true
```

Useful for a `--verbose` flag in a CLI.

## debug vs log levels

debug filters by where a message comes from. [Log levels](/blog/log-level-hierarchy) filter by how severe it is. They answer different questions and work well together: levels for what production keeps, debug namespaces for digging into one module.

logmoji has neither namespaces nor an environment switch per module. Its closest tools are `createContext` labels, which add a prefix such as `db > pool`, and the `levels` and `minLevel` options. Be careful with those two in logmoji 1.3.0: a `levels` list that contains only unknown names silences every line, and an unknown `minLevel` turns filtering off instead of failing. Use the exact names from the [usage page](/usage).

## FAQ

### How do I turn on debug output in Node.js?

Set the DEBUG environment variable to the namespaces you want, for example DEBUG=app:* node app.js. Without DEBUG, debuggers created with the debug package print nothing.

### How do I exclude one namespace in DEBUG?

Prefix it with a minus sign: DEBUG=app:*,-app:db prints every app namespace except app:db.

### Does debug write to stdout or stderr?

stderr, by default. The README shows how to send one namespace to stdout by setting its log method to console.log.bind(console).

## Related posts

- [How the log level hierarchy filters messages](/blog/log-level-hierarchy)
- [What console.error does differently from console.log](/blog/console-error)
- [Printing nested objects in full with console.dir](/blog/console-dir)
- [All posts](/blog/)
