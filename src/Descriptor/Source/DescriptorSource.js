const md5 = require('md5');
const { finalizeAndNormalize } = require('../../Util');

module.exports = class TrackerSource {
  config = null;
  data = null;

  get id() {
    return this.config?.id;
  }

  get name() {
    return this.config?.name;
  }

  get predicate() {
    return this.config?.data.predicate;
  }

  get destinationIds() {
    // Should be filtered on import!
    return this.config?.destinations;
  }

  get items() {
    throw new Error('Not Implemented in TrackerSource');
  }

  getEntryHash(entry) {
    throw new Error('Not Implemented in TrackerSource');
  }

  getEntryName(entry) {
    throw new Error('Not Implemented in TrackerSource');
  }

  getEntryUrl(entry) {
    throw new Error('Not Implemented in TrackerSource');
  }

  getEntrySerializedData(entry) {
    return JSON.stringify(entry);
  }

  constructor(config) {
    this.config = config;
  }

  async hydrate() {
    this.data = await this.performHydration();
  }

  async performHydration() {
    throw new Error('Not Implemented in TrackerSource');
  }

  async iterateEntries(cb) {
    // @ts-ignore
    const filteredItems = this.items.filter(this.predicate);

    return finalizeAndNormalize(filteredItems.map(cb));
  }
};
