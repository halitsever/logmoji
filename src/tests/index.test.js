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

  // TODO: Add unit tests for config & timestamp functions
});
