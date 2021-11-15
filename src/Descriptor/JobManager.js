const EntriesModel = require('../db/Models/EntriesModel');

const Logger = require('-/Logger');
const { Separator, finalizeAndNormalize } = require('-/Util');
const chalk = require('chalk');
const DescriptorImporter = require('./DescriptorImporter');

module.exports = class JobManager {
  _loadMap = {};
  _descriptors = [];

  async scanAndCreateEntries() {
    Separator(true);
    const hydratedSources = await this._importAndHydrateSources();
    Separator();

    return await this._saveSourcesEntries(hydratedSources);
  }

  /**************************************************************************************************************************************
   * Import and Hydrating Sources
   *************************************************************************************************************************************/

  async _importAndHydrateSources() {
    let destinations, sources;

    destinations = await DescriptorImporter.ImportDestinations();
    sources = await DescriptorImporter.ImportSources();

    Logger.info(`Imported ${destinations.length} Destination Descriptors`);
    Logger.info(`Imported ${sources.length} Source Descriptors`);

    if (!sources.length) {
      //! TODO - Test this
      throw new Error(
        `No TrackerDescriptors Found. Please ensure path is correct: ${DescriptorImporter.BaseTrackerPath}`
      );
    }

    return await this._hydrateSources(sources);
  }

  async _hydrateSources(sources) {
    Logger.info(`Attempting to retrieve data for ${sources.length} Sources`);

    const entries = sources.map(async currSource => {
      try {
        await currSource.hydrate();
        return currSource;
      } catch (err) {
        Logger.error(`Error Scanning Source: ${currSource.name}\n\t${err}`);
        return null;
      }
    });

    return finalizeAndNormalize(entries);
  }

  /**************************************************************************************************************************************
   * Filtering and Storing Tracker Source Entries
   *************************************************************************************************************************************/

  async _saveSourcesEntries(sources) {
    let numEntries = 0;
    const entriesPerSource = [];

    const savePromiseChain = sources.reduce(async (promiseChain, currSource) => {
      return promiseChain.then(async () => {
        const sourceEntries = await this._saveEntriesForSource(currSource);
        numEntries += sourceEntries.length;
        entriesPerSource.push(sourceEntries);

        Separator();

        return sourceEntries;
      });
    }, Promise.resolve());

    await savePromiseChain;

    Logger.info(`Added ${numEntries} Entries, across ${entriesPerSource.length} Sources`);

    return entriesPerSource;
  }

  async _saveEntriesForSource(source) {
    Logger.debug(chalk.cyan('Processing Feed Scan Entries:'), source.name);

    return await source.iterateEntries(async entry => {
      let { isValid, model } = await this._returnIfValidEntry(source, entry);

      // Existing Entry, skip it!
      if (!isValid) {
        return null;
      }

      try {
        model = await new EntriesModel({
          id: model?.get('id') || null,
          idHash: source.getEntryHash(entry),
          entryUrl: source.getEntryUrl(entry),
          content: source.getEntrySerializedData(entry),
          destinationIds: source.destinationIds
        }).save();

        return entry;
      } catch (err) {
        Logger.error(`Could not save Entry: ${err}`);

        return null;
      }
    });
  }

  /**************************************************************************************************************************************
   * Filtering for Known Entries
   *************************************************************************************************************************************/

  async _returnIfValidEntry(source, entry) {
    const idHash = source.getEntryHash(entry);
    const entryUrl = source.getEntryUrl(entry);

    // Check Feed Scan Status
    const model = await this._getEntryByIdentifiers(idHash, entryUrl);

    const hashAndNameString = chalk.gray(`[${idHash}] `) + source.getEntryName(entry);

    if (!model) {
      Logger.debug(chalk.bgGreen('New Entry Found'), hashAndNameString);
      return { isValid: true, model, entry };
    }

    Logger.debug(chalk.yellow('Entry Previously Found'), hashAndNameString);

    return { isValid: false, model, entry };
  }

  async _getEntryByIdentifiers(idHash, entryUrl) {
    try {
      // prettier-ignore
      return (
        await EntriesModel
          .query({
            where: { idHash },
            orWhere: { entryUrl }
          })
          .fetch()
      );
    } catch (err) {
      // TODO: Need to make sure this error is actually 'not found'
      return null;
    }
  }
};
