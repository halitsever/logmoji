---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Node.js logger with emojis and colors

hero:
  name: "Logmoji"
  text: "Node.js logger with emojis"
  actions:
    - theme: brand
      text: Get Started
      link: /usage
    - theme: alt
      text: Github Repository
      link: https://github.com/halitsever/logmoji
  image:
    src: /favicon.png
    alt: Logmoji Icon

features:
  - title: Small
    icon: ✅
    details: A very small Node.js logging package with emojis
  - title: Fun
    icon: 💨
    details: Makes reading debug logs more fun
  - title: Painless
    icon: 🆙
    details: Reading debug logs less painless with logmoji
---

## What logmoji is

logmoji is a console logger for Node.js scripts and services. Every line carries an emoji and, by default, a level label, so you can spot a failure in a scrolling terminal without reading each line. It has no runtime dependencies, ships both CommonJS and ESM entry points and comes with TypeScript type definitions.

Use it when `console.log` is too plain but a full logging framework with transports and file rotation is more than you need: CLI tools, bots, build scripts and small servers. Output goes straight to the console methods, so anything that already captures stdout and stderr, such as Docker or systemd, keeps working.

## Quick start

```bash
npm install logmoji
```

The package exports a factory. Call it once with your options and reuse the logger it returns.

```javascript
// CommonJS
const logger = require("logmoji")({ timestamp: true });
```

```javascript
// ESM
import createLogger from "logmoji";
const logger = createLogger({ timestamp: true });
```

```javascript
logger.info("Server listening on port", 3000);
logger.error("Database connection failed", err);
```

Arguments are passed through to the console unchanged, so objects and errors print the same way they do with `console.log`.

## How a line is built

Each call writes the level's ANSI color, an optional timestamp, the level's emoji, a label such as `Info:`, an optional context label, then your arguments, and finally a color reset. The 11 levels map to console methods:

| Console method  | Levels                    |
| --------------- | ------------------------- |
| `console.log`   | `silly`, `debug`, `log`   |
| `console.info`  | `info`, `success`         |
| `console.warn`  | `warn`, `warning`, `fail` |
| `console.error` | `alert`, `error`, `crit`  |

## What you can configure

- **Timestamps** in ISO, locale or Unix format with `timestamp` and `dateFormat`.
- **Filtering** with `minLevel` to drop everything below a severity, or `levels` to allow only a fixed set.
- **Context loggers** with `createContext("Auth")`, which can be nested into labels like `HTTP > GET /users`.
- **Custom emojis and colors** per level through `logSymbols` and `logColors`. Values that are not an emoji or a valid ANSI code fall back to the default.
- **Silence everything** by setting `LOGMOJI_DISABLE=true` in the environment.

Start with the [usage guide](/usage) for every log function, then see the [configuration reference](/config) for all options and their defaults.
