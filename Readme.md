<p align="center" class="logo-section">
<img src="https://i.ibb.co/gvD8wP1/Vulcan-Salute-Medium-Skin-Tone.png" height="80" width="80" alt="Logmoji logo"/>
</br>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Logmoji">

<p align="center">
🪵 Node.js logger that prints each line with an emoji, log levels, console log colors, timestamps and context loggers <br>
<br/>
<br/>
<img src="https://img.shields.io/github/sponsors/halitsever" alt="GitHub sponsors"/> 
<img src="https://img.shields.io/github/license/halitsever/logmoji" alt="License"/> 
</p>
<p align="center">
<a align="center" href="https://halitsever.github.io/logmoji/">Documentation</a>
  </p>
</p>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</a>

- 🧑‍💻 [**Small**](#) - Only 3.63kB
- 🧑‍💻 [**Makes reading debug logs more fun**](#) - Reading debug logs less painless with logmoji

<a align="center" >
<img src="https://halitsever-api.vercel.app/api/installation"/>
</a>

```bash
npm install logmoji --save
```

Usage:

```javascript
const logger = require("logmoji")({ timestamp: false });

logger.success("You did it!");
// Success: ✅ You did it
```

Each level prints in its own console log color, green for success and red for errors. Change them with the `logColors` option described in the [configuration docs](https://halitsever.github.io/logmoji/config.html).

<a align="center" href="https://github.com/halitsever/logmoji/issues">
<img src="https://halitsever-api.vercel.app/api/issue"/>
</a>

<p align="center">
Found a bug or have an idea? Open an <a href="https://github.com/halitsever/logmoji/issues">issue</a>.<br/>
Read the <a href=".github/CONTRIBUTING.md">contributing guide</a> before sending a pull request.
</p>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/sponsor"/>
</a>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/license"/>
</a>

<p align="center">
  MIT LICENSE | <a href="https://github.com/halitsever">Halit Sever</a>
</p>
