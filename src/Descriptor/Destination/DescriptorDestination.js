module.exports = class TrackerDestination {
  config = null;

  get template() {
    throw new Error('Not Implemented in TrackerDestination');
  }

  constructor(config) {
    this.config = config;
  }

  async getTemplatedEntry(entry) {
    // @ts-ignore
    return await this.template(entry);
  }
};
