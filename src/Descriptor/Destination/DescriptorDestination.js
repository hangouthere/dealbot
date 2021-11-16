const Mustache = require('mustache');

const EntriesModel = require('-/db/Models/EntriesModel');
const Logger = require('-/Logger');
const { finalizeAndNormalize } = require('-/Util');

module.exports = class DescriptorDestination {
  config = null;
  data = null;
  notifyData = null;

  get id() {
    return this.config?.id;
  }

  get name() {
    return this.config?.name;
  }

  constructor(config) {
    this.config = config;
  }

  async hydrate() {
    const collection = await EntriesModel.getEntriesForDestinationId(this.config.id);

    this.data = collection.serialize();
  }

  async getTemplatedEntry(sourceLoader, entry) {
    return Mustache.render(this.config?.template, {
      title: sourceLoader.getEntryName(entry),
      url: sourceLoader.getEntryUrl(entry)
    });
  }

  async deserializeEntries(sourceLoadMap) {
    let sourceId, chosenSourceLoader;

    const deserializedModels = this.data.map(async entry => {
      sourceId = entry.sourceId;
      chosenSourceLoader = sourceLoadMap[sourceId];

      if (!chosenSourceLoader) {
        Logger.error(`Unable to parse saved Entry [${entry.idHash}], invalid Source ID: ${sourceId}`);

        return null;
      }

      const deserializedData = await chosenSourceLoader.getEntryDeserializedData(entry.content);

      // NotifyData type
      return {
        entry,
        deserializedData,
        sourceLoader: chosenSourceLoader,
        templatedEntry: await this.getTemplatedEntry(sourceLoadMap[entry.sourceId], deserializedData)
      };
    });

    const notifyData = await finalizeAndNormalize(deserializedModels);

    this.notifyData = notifyData;
  }

  async iterateNotifies(cb) {
    // prettier-ignore
    return this
      .notifyData
      .reduce(async (promiseChain, notifyData) => await promiseChain.then(cb.bind(cb, notifyData)), Promise.resolve())
  }

  async notifyDestination(notifyData) {
    throw new Error('Not implemented in DescriptorDestination');
  }
};
