const EntriesModel = require('../db/Models/EntriesModel');

const Logger = require('-/Logger');
const { Separator, finalizeAndNormalize } = require('-/Util');
const chalk = require('chalk');
const DescriptorImporter = require('./DescriptorImporter');

module.exports = class JobManager {
  /**************************************************************************************************************************************
   * Job Entry Points
   *************************************************************************************************************************************/

  async scanAndCreateEntries() {
    Separator(true);
    const hydratedSources = await this._importAndHydrateSources();
    Separator();

    return await this._saveSourcesEntries(hydratedSources);
  }

  async notifyDestinations() {
    Separator(true);
    const hydratedDestinations = await this._importAndHydrateDestinations();
    Separator();

    return await this._notifyDestinations(hydratedDestinations);
  }

  /**************************************************************************************************************************************
   * Common Helper Functions
   *************************************************************************************************************************************/

  async _hydrateDescriptors(descriptors) {
    const entries = descriptors.map(async currDescriptor => {
      try {
        await currDescriptor.hydrate();
        return currDescriptor;
      } catch (err) {
        Logger.error(`Error Scanning Source: ${currDescriptor.name}\n\t${err}`);
        return null;
      }
    });

    return finalizeAndNormalize(entries);
  }

  async _importAllDescriptors() {
    const destinations = await DescriptorImporter.ImportDestinations();
    const sources = await DescriptorImporter.ImportSources();

    Logger.info(`Imported ${destinations.length} Destination Descriptors`);
    Logger.info(`Imported ${sources.length} Source Descriptors`);

    return { sources, destinations };
  }

  /**************************************************************************************************************************************
   * Import and Hydrating Sources
   *************************************************************************************************************************************/

  async _importAndHydrateSources() {
    const { sources } = await this._importAllDescriptors();

    if (!sources.length) {
      //! TODO - Test this
      throw new Error(
        `No Destination Descriptors Found. Please ensure path is correct: ${DescriptorImporter.PathDescriptorsSources}`
      );
    }

    Logger.info(`Attempting to retrieve data for ${sources.length} Source Descriptors`);

    return await this._hydrateDescriptors(sources);
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
          id: model?.id || null,
          sourceId: source.id,
          idHash: source.getEntryHash(entry),
          entryUrl: source.getEntryUrl(entry),
          content: await source.getEntrySerializedData(entry),
          destinationIds: source.destinationIds
        }).save();

        return entry;
      } catch (err) {
        Logger.error(`Could not save Entry: ${err}`);

        return null;
      }
    });
  }

  async _returnIfValidEntry(source, entry) {
    const idHash = source.getEntryHash(entry);
    const entryUrl = source.getEntryUrl(entry);

    // Check Feed Scan Status
    let model = await this._getEntryByIdentifiers(idHash, entryUrl);

    const hashAndNameString = chalk.gray(`[${idHash}] `) + source.getEntryName(entry);

    if (!model) {
      Logger.debug(chalk.bgGreen('New Entry Found'), hashAndNameString);
      return { isValid: true, model, entry };
    }

    model = model.serialize();

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

  /**************************************************************************************************************************************
   **************************************************************************************************************************************
   *************************************************************************************************************************************/

  /**************************************************************************************************************************************
   * Import and Hydrating Destinations
   *************************************************************************************************************************************/

  async _importAndHydrateDestinations() {
    let { destinations } = await this._importAllDescriptors();

    if (!destinations.length) {
      //! TODO - Test this
      throw new Error(
        `No Destination Descriptors Found. Please ensure path is correct: ${DescriptorImporter.PathDescriptorsDestinations}`
      );
    }

    destinations = await this._hydrateDescriptors(destinations);

    const deserializePromises = destinations.map(
      async destination => await destination.deserializeEntries(DescriptorImporter.LoadMap.sources)
    );

    await finalizeAndNormalize(deserializePromises);

    return destinations;
  }

  /**************************************************************************************************************************************
   * Notifying Destinations
   *************************************************************************************************************************************/

  async _notifyDestinations(hydratedDestinations) {
    let totalNotifies = 0;

    const promiseChain = hydratedDestinations.reduce(async (promiseChain, destination) => {
      // Add up count for messaging
      totalNotifies += destination.notifyData.length;
      return await promiseChain.then(this._notifyDestination.bind(this, destination));
    }, Promise.resolve());

    Logger.info(
      `Sending ${chalk.red(totalNotifies)} Notifications across ${chalk.yellow(
        hydratedDestinations.length
      )} Destinations...`
    );

    return await promiseChain;
  }

  async _notifyDestination(destination) {
    Logger.info(chalk.cyan('Processing Notifications for Destination:'), destination.name);

    return destination.iterateNotifies(async notifyData => {
      const resp = await destination.notifyDestination(notifyData);

      await EntriesModel.markNotified(notifyData.entry);

      return resp;
    });
  }
};
