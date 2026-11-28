---
title: "toISOString in JavaScript: Format and Time Zones"
titleTemplate: false
description: "How toISOString formats a JavaScript date: always UTC with a Z, extended years, the RangeError for invalid dates, toJSON, and local time strings for log files."
headline: "What Date.prototype.toISOString returns, and when it throws"
date: "2026-11-28"
keyword: "toisostring"
faq: [{"q": "Does toISOString return local time?", "a": "No. MDN says the time zone is always UTC, as shown by the Z suffix. A date created at 14:05 in Istanbul (UTC+3) prints as 11:05Z."}, {"q": "Why does toISOString throw RangeError: Invalid time value?", "a": "The Date is invalid, for example new Date('nope'). toISOString throws a RangeError for it, while toString returns 'Invalid Date' and toJSON returns null."}, {"q": "How do I get a date in YYYY-MM-DD format from toISOString?", "a": "toISOString().slice(0, 10) gives the UTC date. Near midnight that can be a different day than the local one, so format local dates with getFullYear, getMonth and getDate, or with Intl.DateTimeFormat."}]
---

# What Date.prototype.toISOString returns, and when it throws

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">toISOString is the method most JavaScript code uses to turn a Date into a string for logs, APIs and file names. It always produces the same shape, which is why it is a good default, and it always uses UTC, which surprises people who expected local time. This post shows what it returns, with output from Node.js 22, and how logmoji uses it for timestamps.</p>

## The format

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) describes the result as a string in the date time string format, `YYYY-MM-DDTHH:mm:ss.sssZ`, always 24 characters for years 0 to 9999, and the time zone is always UTC, shown by the `Z`.

These lines ran in Node.js 22 with `TZ=Europe/Istanbul`, three hours ahead of UTC:

```js
const d = new Date(2026, 10, 28, 14, 5, 9, 7); // 28 Nov 2026, 14:05:09.007 local time

d.toISOString();     // '2026-11-28T11:05:09.007Z'
d.toString();        // 'Sat Nov 28 2026 14:05:09 GMT+0300 (Türkiye Standard Time)'
d.toLocaleString();  // '11/28/2026, 2:05:09 PM'
```

The ISO string is three hours earlier on the clock and describes the same moment. Months in the `Date` constructor start at 0, which is why November is `10`.

## Years outside 0 to 9999

MDN notes that years outside that range use the expanded form with six digits and a sign:

```js
new Date(Date.UTC(-1, 0, 1)).toISOString();    // '-000001-01-01T00:00:00.000Z'
new Date(Date.UTC(10000, 0, 1)).toISOString(); // '+010000-01-01T00:00:00.000Z'
```

## Invalid dates throw

```js
new Date("nope").toISOString(); // RangeError: Invalid time value
String(new Date("nope"));        // 'Invalid Date'
new Date("nope").toJSON();       // null
```

A logger that calls `toISOString()` on a date it parsed from user input can crash on one bad value. Check `Number.isNaN(date.getTime())` first when the date does not come from `new Date()` or `Date.now()`.

## toJSON and JSON.stringify

`toJSON()` returns the same string as `toISOString()` for a valid date, and `JSON.stringify` calls it:

```js
JSON.stringify({ at: d }); // '{"at":"2026-11-28T11:05:09.007Z"}'
```

That is why APIs and [structured logs](/blog/structured-logging) so often carry ISO strings: you get them without asking.

## Parsing it back

```js
new Date("2026-11-28T11:05:09.007Z").getTime(); // 1795863909007
```

Watch the inputs without a time zone. A date-only string is read as UTC, a date-time without `Z` as local time:

```js
new Date("2026-11-28").toISOString();       // '2026-11-28T00:00:00.000Z'
new Date("2026-11-28T00:00").toISOString(); // '2026-11-27T21:00:00.000Z' in Istanbul
```

## Local time with an offset

There is no built-in method for an ISO string in local time. Two common ways:

```js
// Shift by the offset, then swap the Z for the real offset
const off = -d.getTimezoneOffset(); // 180 minutes in Istanbul
new Date(d.getTime() + off * 60000).toISOString().replace("Z", "+03:00");
// '2026-11-28T14:05:09.007+03:00'

// Intl with the Swedish locale, which happens to format as YYYY-MM-DD HH:mm:ss
new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "medium", timeZone: "Europe/Istanbul" }).format(d);
// '2026-11-28 14:05:09'
```

Building the `+03:00` part by hand from `off` is left out above for brevity; hard-coding it only works in one zone.

For log files, UTC with `Z` is usually the better choice anyway: lines from servers in different zones sort correctly together.

## How logmoji uses it

logmoji's `timestamp` option prefixes each line with the time in brackets. The format comes from `dateFormat` ([src/utils/format-date.js](https://github.com/halitsever/logmoji/blob/main/src/utils/format-date.js)):

| `dateFormat` | Calls | Example |
| --- | --- | --- |
| `"iso"` (default) | `toISOString()` | `[2026-11-28T11:12:05.271Z]` |
| `"locale"` | `toLocaleString()` | `[11/28/2026, 2:12:05 PM]` |
| `"unix"` | `String(Date.now())` | `[1795864325308]` |

Two things to know. An unknown `dateFormat` falls back to ISO. And `"unix"` gives milliseconds, not the seconds most tools mean by a Unix timestamp.

```js
const createLogger = require("logmoji");
const logger = createLogger({ timestamp: true }); // ISO by default
logger.info("server started");
// [2026-11-28T11:11:23.673Z] [emoji] Info: server started
```

Output lines are copied from the terminal with logmoji's emoji replaced by `[emoji]`.

## FAQ

### Does toISOString return local time?

No. MDN says the time zone is always UTC, as shown by the Z suffix. A date created at 14:05 in Istanbul (UTC+3) prints as 11:05Z.

### Why does toISOString throw RangeError: Invalid time value?

The Date is invalid, for example new Date('nope'). toISOString throws a RangeError for it, while toString returns 'Invalid Date' and toJSON returns null.

### How do I get a date in YYYY-MM-DD format from toISOString?

toISOString().slice(0, 10) gives the UTC date. Near midnight that can be a different day than the local one, so format local dates with getFullYear, getMonth and getDate, or with Intl.DateTimeFormat.

## Related posts

- [Logging in Node.js without a framework](/blog/nodejs-logging-basics)
- [Reading and managing Node.js logs under pm2](/blog/pm2-logs)
- [Structured logs: why logs became JSON, with Node.js output](/blog/structured-logging)
- [All posts](/blog/)
