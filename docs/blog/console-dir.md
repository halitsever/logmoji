---
title: "console.dir in Node.js: depth, colors, showHidden"
titleTemplate: false
description: "How console.dir prints objects in Node.js and how it differs from console.log: depth, colors and showHidden options, depth null, circular refs and util.inspect."
headline: "Printing nested objects in full with console.dir"
date: "2026-11-28"
keyword: "console.dir"
faq: [{"q": "What is the difference between console.log and console.dir in Node.js?", "a": "Both print to stdout. console.dir takes one object and an options object for util.inspect, such as depth and colors. console.log takes several values and a format string, and inspects objects with the defaults."}, {"q": "How do I print a full nested object in Node.js?", "a": "console.dir(obj, { depth: null }). The default depth is 2, so deeper levels print as [Object]."}, {"q": "Why does Node.js print [Object] instead of the value?", "a": "util.inspect stops recursing at depth 2 by default. Raise the depth with console.dir or util.inspect, or use JSON.stringify for plain data."}]
---

# Printing nested objects in full with console.dir

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Log a nested object in Node.js and the inner levels turn into [Object]. console.dir is the quickest way to see all of it. This post shows its options with real output from Node.js 22, and how it compares with console.log and JSON.stringify.</p>

## The problem

```js
const cfg = { server: { http: { tls: { cert: "/etc/ssl/a.pem", ciphers: ["A", "B"] } } }, port: 3000 };
console.log(cfg);
// { server: { http: { tls: [Object] } }, port: 3000 }
```

The `tls` object is three levels down, one more than the default.

## console.dir with depth

The [Node.js docs](https://nodejs.org/api/console.html) describe `console.dir(obj[, options])` as using `util.inspect()` on the object and printing the result to stdout. Its options:

| Option | Default | Effect |
| --- | --- | --- |
| `depth` | `2` | How many levels to recurse. `null` means no limit |
| `colors` | `false` | ANSI colors for types |
| `showHidden` | `false` | Also show non-enumerable and symbol properties |

```js
console.dir(cfg, { depth: null });
```

```text
{
  server: {
    http: { tls: { cert: '/etc/ssl/a.pem', ciphers: [ 'A', 'B' ] } }
  },
  port: 3000
}
```

And the other way, `depth: 0` keeps only the top level: `{ server: [Object], port: 3000 }`.

## What it prints that JSON does not

```js
console.dir(new Map([["a", 1]]));      // Map(1) { 'a' => 1 }
const x = {}; x.self = x;
console.dir(x);                        // <ref *1> { self: [Circular *1] }
```

`JSON.stringify` turns a Map into `{}` and throws on the circular reference. On plain data it gives `{"server":{"http":{"tls":{"cert":"/etc/ssl/a.pem","ciphers":["A","B"]}}},"port":3000}`, all levels on one line, which is better when the output goes to a [structured log](/blog/structured-logging) and worse for reading.

Class instances print with their class name, and private fields stay hidden: `console.dir(new User())` printed `User { name: 'ada' }` for a class with a `#secret` field.

## colors

`console.dir("text", { colors: true })` wraps the value in ANSI codes (`\x1b[32m'text'\x1b[39m`), even when stdout is a file. Leave it off when the output is redirected.

## util.inspect directly

console.dir is a thin wrapper. When you need the string, for example to add it to a log line, call [util.inspect](https://nodejs.org/api/util.html#utilinspectobject-options) with the same options, plus extras such as `compact`, `breakLength` and `sorted`:

```js
const util = require("node:util");
const text = util.inspect(cfg, { depth: Infinity, compact: false });
```

With `compact: false`, the example above spread over 14 lines, one property per line.

## In the browser

In browser DevTools, `console.dir` shows an interactive tree of the object's properties, which for a DOM element differs from `console.log`, which shows the element as HTML. In Node.js the two print through the same inspector; the difference is only the options.

## With logmoji

logmoji passes your arguments to the console methods after its prefix, so objects are inspected the same way as with `console.log`, at depth 2:

```js
logger.info("config", cfg);
// [emoji] Info: config { server: { http: { tls: [Object] } }, port: 3000 }
```

For a full dump, inspect first and log the string: `logger.info("config", util.inspect(cfg, { depth: null }))`. The [debug post](/blog/debug-npm) covers `DEBUG_DEPTH`, the same setting for the debug package.

## FAQ

### What is the difference between console.log and console.dir in Node.js?

Both print to stdout. console.dir takes one object and an options object for util.inspect, such as depth and colors. console.log takes several values and a format string, and inspects objects with the defaults.

### How do I print a full nested object in Node.js?

console.dir(obj, { depth: null }). The default depth is 2, so deeper levels print as [Object].

### Why does Node.js print [Object] instead of the value?

util.inspect stops recursing at depth 2 by default. Raise the depth with console.dir or util.inspect, or use JSON.stringify for plain data.

## Related posts

- [What console.error does differently from console.log](/blog/console-error)
- [Turning debug output on and off with the debug package](/blog/debug-npm)
- [Logging in Node.js without a framework](/blog/nodejs-logging-basics)
- [All posts](/blog/)
