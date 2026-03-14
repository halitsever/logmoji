const main = require("../index");

describe("Main function", () => {
  it("should return functions for logging", () => {
    const logger = main({ params: { timestamp: true } });

    expect(typeof logger.success).toBe("function");
    expect(typeof logger.fail).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.log).toBe("function");
  });

  it("should return createContext function", () => {
    const logger = main({});
    expect(typeof logger.createContext).toBe("function");
  });

  // TODO: Add unit tests for config & timestamp functions
});

describe("createContext", () => {
  it("should return logging functions", () => {
    const logger = main({});
    const ctx = logger.createContext("Auth");

    expect(typeof ctx.success).toBe("function");
    expect(typeof ctx.fail).toBe("function");
    expect(typeof ctx.warn).toBe("function");
    expect(typeof ctx.error).toBe("function");
    expect(typeof ctx.info).toBe("function");
    expect(typeof ctx.log).toBe("function");
  });

  it("should prefix output with [context]", () => {
    const logger = main({});
    const ctx = logger.createContext("Auth");
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    ctx.info("test message");

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Auth"), "test message", expect.any(String));

    spy.mockRestore();
  });

  it("should not include context prefix when using logger directly", () => {
    const logger = main({});
    const spy = jest.spyOn(console, "info").mockImplementation(() => {});

    logger.info("test message");

    expect(spy).toHaveBeenCalledWith(expect.not.stringContaining("Auth"), "test message", expect.any(String));

    spy.mockRestore();
  });
});
