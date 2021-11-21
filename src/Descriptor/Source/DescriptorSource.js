const { FinalizeAndNormalize, NormalizeToArrayIfPossible } = require('../../Util');
const ComplexSearch = require('./Predicates/ComplexSearch');

const PREDICATES_INTERNAL = {
  complexsearch: ComplexSearch
};

module.exports = class DescriptorSource {
  config = null;
  data = null;
  predicate = null;

  get id() {
    return this.config?.id;
  }

  get name() {
    return this.config?.name;
  }

  get destinationIds() {
    // Should be filtered on import!
    return this.config?.destinations;
  }

  get items() {
    throw new Error('Not Implemented in DescriptorSource');
  }

  getEntryHash(entry) {
    throw new Error('Not Implemented in DescriptorSource');
  }

  getEntryName(entry) {
    throw new Error('Not Implemented in DescriptorSource');
  }

  getEntryUrl(entry) {
    throw new Error('Not Implemented in DescriptorSource');
  }

  async getEntrySerializedData(entry) {
    return JSON.stringify(entry);
  }

  async getEntryDeserializedData(content) {
    return JSON.parse(content);
  }

  constructor(config) {
    this.config = config;
  }

  async hydrate() {
    this.data = await this.performHydration();

    this.predicate = this._hydratePredicate();
  }

  async performHydration() {
    throw new Error('Not Implemented in DescriptorSource');
  }

  async iterateEntries(cb) {
    // @ts-ignore
    const filteredItems = this.items.filter(this.predicate);

    return FinalizeAndNormalize(filteredItems.map(cb));
  }

  _hydratePredicate() {
    const configPredicate = NormalizeToArrayIfPossible(this.config.predicate);
    const configIsFunc = typeof configPredicate === 'function';

    let predicateType = configPredicate?.type?.toLowerCase() ?? 'complexsearch';
    predicateType = configIsFunc ? 'suppliedFunction' : predicateType;

    const chosenPredicate =
      'suppliedFunction' === predicateType ? configPredicate : PREDICATES_INTERNAL[predicateType](configPredicate);

    if (!chosenPredicate) {
      throw new Error(`Invalid Predicate Type: ${predicateType}`);
    }

    return chosenPredicate;
  }
};
