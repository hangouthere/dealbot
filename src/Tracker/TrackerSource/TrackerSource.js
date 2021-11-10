module.exports = class TrackerSource {
  config = null;
  data = null;

  get predicate() {
    return this.config?.data.predicate;
  }

  constructor(config) {
    this.config = config;
  }

  async hydrate() {
    throw new Error('Not Implemented in TrackerSource');
  }
};
