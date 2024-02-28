class ConfigClass {
  constructor({ timestamp }) {
    this.config = {
      timestamp: timestamp || false,
    };
  }

  getConfig() {
    return this.config;
  }
}

module.exports = ConfigClass;
