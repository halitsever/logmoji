const createLogger = require("../index");

describe("createLogger factory", () => {
  it("returns all 11 log method functions", () => {
    const logger = createLogger({ timestamp: true });
    const levels = ["success", "fail", "warn", "error", "info", "log", "alert", "crit", "warning", "debug", "silly"];
    levels.forEach((level) => expect(typeof logger[level]).toBe("function"));
  });

  it("returns a createContext function", () => {
    const logger = createLogger({});
    expect(typeof logger.createContext).toBe("function");
  });
});

describe("isLoggingDisabled (LOGMOJI_DISABLE)", () => {
  afterEach(() => {
    delete process.env.LOGMOJI_DISABLE;
  });

  it("suppresses all output when LOGMOJI_DISABLE=true", () => {
    process.env.LOGMOJI_DISABLE = "true";
    const logger = createLogger({});
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("should be hidden");

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("does not suppress when LOGMOJI_DISABLE is unset", () => {
    const logger = createLogger({});
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("should appear");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("does not suppress when LOGMOJI_DISABLE=false (old bug regression)", () => {
    process.env.LOGMOJI_DISABLE = "false";
    const logger = createLogger({});
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("should appear");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("timestamp and dateFormat", () => {
  it("omits timestamp when timestamp is false", () => {
    const logger = createLogger({ timestamp: false });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    // ANSI codes like \x1b[0m contain "[" too — check that no date-like bracket (4+ digits) is present
    expect(spy).toHaveBeenCalledWith(expect.not.stringMatching(/\[\d{4,}/), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("includes ISO timestamp when dateFormat is iso", () => {
    const logger = createLogger({ timestamp: true, dateFormat: "iso" });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    // ISO format: 2024-01-15T10:30:00.000Z
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T/), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("includes locale timestamp when dateFormat is locale", () => {
    const logger = createLogger({ timestamp: true, dateFormat: "locale" });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("["), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("includes unix timestamp when dateFormat is unix", () => {
    const logger = createLogger({ timestamp: true, dateFormat: "unix" });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    // Unix format: [1705312200000]
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/\[\d+\]/), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("defaults to iso format when dateFormat is not specified", () => {
    const logger = createLogger({ timestamp: true });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T/), "msg", expect.any(String));
    spy.mockRestore();
  });
});

describe("disablePrefixText", () => {
  it("includes level label when disablePrefixText is false", () => {
    const logger = createLogger({ disablePrefixText: false });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Info:"), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("omits level label when disablePrefixText is true", () => {
    const logger = createLogger({ disablePrefixText: true });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.not.stringContaining("Info:"), "msg", expect.any(String));
    spy.mockRestore();
  });
});

describe("minLevel filtering", () => {
  it("logs everything when minLevel is not set", () => {
    const logger = createLogger({});
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    logger.silly("msg");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("suppresses levels below minLevel", () => {
    const logger = createLogger({ minLevel: "info" });
    const sillySpy = jest.spyOn(console, "log").mockImplementation(() => {});

    logger.silly("should be hidden");
    logger.debug("should be hidden");

    expect(sillySpy).not.toHaveBeenCalled();
    sillySpy.mockRestore();
  });

  it("allows levels at and above minLevel", () => {
    const logger = createLogger({ minLevel: "info" });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("visible");
    logger.success("visible");

    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  it("logs everything when minLevel is an unknown string (graceful fallback)", () => {
    const logger = createLogger({ minLevel: "nonexistent" });
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    logger.silly("msg");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("levels allowlist", () => {
  it("only outputs listed levels", () => {
    const logger = createLogger({ levels: ["warn", "info"] });
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    logger.warn("shown");
    logger.info("shown");
    logger.debug("hidden");
    logger.error("hidden");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    infoSpy.mockRestore();
    logSpy.mockRestore();
  });

  it("ignores invalid level names in the allowlist", () => {
    const logger = createLogger({ levels: ["info", "notavalidlevel"] });
    const infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("shown");

    expect(infoSpy).toHaveBeenCalledTimes(1);
    infoSpy.mockRestore();
  });

  it("levels takes precedence over minLevel when both are set", () => {
    const logger = createLogger({ levels: ["debug"], minLevel: "error" });
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    logger.debug("shown by allowlist");
    logger.error("hidden by allowlist");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("logs everything when levels is an empty array", () => {
    const logger = createLogger({ levels: [] });
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    logger.silly("msg");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("custom logSymbols", () => {
  it("overrides the default emoji when a valid emoji is provided", () => {
    const logger = createLogger({ logSymbols: { info: "🔥" } });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("🔥"), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("falls back to the default emoji when an invalid value is provided", () => {
    const logger = createLogger({ logSymbols: { info: "not-an-emoji" } });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    // default info emoji is 📄
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("📄"), "msg", expect.any(String));
    spy.mockRestore();
  });
});

describe("custom logColors", () => {
  it("overrides the default color when a valid ANSI code is provided", () => {
    const blueAnsi = "\x1b[34m";
    const logger = createLogger({ logColors: { info: blueAnsi } });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining(blueAnsi), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("falls back to the default color when an invalid ANSI code is provided", () => {
    const logger = createLogger({ logColors: { info: "not-a-color" } });
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("msg");

    // default info color is reset \x1b[0m
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("\x1b[0m"), "msg", expect.any(String));
    spy.mockRestore();
  });
});

describe("createContext", () => {
  it("returns all 11 log methods", () => {
    const logger = createLogger({});
    const ctx = logger.createContext("Auth");
    const levels = ["success", "fail", "warn", "error", "info", "log", "alert", "crit", "warning", "debug", "silly"];
    levels.forEach((level) => expect(typeof ctx[level]).toBe("function"));
  });

  it("prefixes output with the context label", () => {
    const logger = createLogger({});
    const ctx = logger.createContext("Auth");
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    ctx.info("test message");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Auth"), "test message", expect.any(String));
    spy.mockRestore();
  });

  it("does not include context prefix when using root logger directly", () => {
    const logger = createLogger({});
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("test message");

    expect(spy).toHaveBeenCalledWith(expect.not.stringContaining("Auth"), "test message", expect.any(String));
    spy.mockRestore();
  });

  it("returns an object that also has a createContext method (supports nesting)", () => {
    const logger = createLogger({});
    const ctx = logger.createContext("HTTP");
    expect(typeof ctx.createContext).toBe("function");
  });

  it("nested createContext concatenates labels with ' > '", () => {
    const logger = createLogger({});
    const nested = logger.createContext("HTTP").createContext("GET /users");
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    nested.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("HTTP > GET /users"), "msg", expect.any(String));
    spy.mockRestore();
  });

  it("triple nesting joins all three labels", () => {
    const logger = createLogger({});
    const deep = logger.createContext("App").createContext("HTTP").createContext("Auth");
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    deep.info("msg");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("App > HTTP > Auth"), "msg", expect.any(String));
    spy.mockRestore();
  });
});

describe("warn and warning", () => {
  it("warn routes to console.warn", () => {
    const logger = createLogger({});
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

    logger.warn("msg");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("warning routes to console.warn", () => {
    const logger = createLogger({});
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

    logger.warning("msg");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
