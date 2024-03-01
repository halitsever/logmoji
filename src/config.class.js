class ConfigClass {
  constructor({ timestamp }) {
    this.config = {
      timestamp: timestamp || false,
      isLoggingDisabled: process.env.LOG || false,
    };
  }

  getConfig() {
    return this.config;
  }
}

module.exports = ConfigClass;
