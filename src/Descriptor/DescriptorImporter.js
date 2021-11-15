const path = require('path');
const fs = require('fs/promises');

const Logger = require('-/Logger');
const chalk = require('chalk');
const DescriptorFactory = require('./DescriptorFactory');

const PATH_DESCRIPTORS_BASE = process.env.PATH_DESCRIPTORS_BASE || 'trackerDescriptors';
const DESCRIPTOR_EXTENSIONS = process.env.DESCRIPTOR_EXTENSIONS?.split(' ') || '.js .json'.split(' ');

const BaseTrackerPath = path.join(process.cwd(), PATH_DESCRIPTORS_BASE);
const SourcesTrackerPath = path.join(BaseTrackerPath, 'sources');
const DestinationsTrackerPath = path.join(BaseTrackerPath, 'destinations');

class DescriptorImporter {
  static _loadMap = {
    sources: {},
    destinations: {}
  };

  static async ImportSources() {
    if (0 === Object.keys(this._loadMap.destinations).length) {
      throw new Error('You must import at least ONE Descriptor before loading Sources!');
    }

    return this.ImportDescriptors('sources', SourcesTrackerPath).then(
      this._filterOutSourcesWithInvalidDestinations.bind(this)
    );
  }

  static async ImportDestinations() {
    return this.ImportDescriptors('destinations', DestinationsTrackerPath);
  }

  static async ImportDescriptors(descriptorType, descriptorPath) {
    try {
      const files = await fs.readdir(descriptorPath);

      return (
        files
          // Only include valid extensions
          .filter(fileName => DESCRIPTOR_EXTENSIONS.includes(path.extname(fileName).toLowerCase()))
          // Import Descriptor Configurations Files as JS objects
          .map(this._loadDescriptorFromFilename.bind(this, descriptorType, descriptorPath))
          // Filter out NULL values
          .filter(v => !!v)
          // Configure a Descriptor Type
          .map(DescriptorFactory.CreateFromDescriptorType.bind(DescriptorFactory, descriptorType))
      );
    } catch (err) {
      if ('ENOENT' === err.code) {
        throw new Error(`Tracker Path cannot be read: ${descriptorPath}`);
      } else {
        throw new Error(err);
      }
    }
  }

  static _loadDescriptorFromFilename(loadType, basePath, filename) {
    const descriptorConfig = require(path.join(basePath, filename));
    // Assign Descriptor ID if not predefined, as the filename
    descriptorConfig.id = descriptorConfig.id ?? path.basename(filename).split('.')[0];

    if (this._loadMap[loadType][descriptorConfig.id]) {
      Logger.warn(
        chalk.yellow('Descriptor ID is already in use:'),
        `(${loadType}) [${filename}] ${descriptorConfig.id}`
      );
      return null;
    }

    this._loadMap[loadType][descriptorConfig.id] = descriptorConfig;

    Logger.debug(`Descriptor Loaded: (${loadType}) [${descriptorConfig.id}] ${filename}`);

    return descriptorConfig;
  }

  static _filterOutSourcesWithInvalidDestinations(sources) {
    return sources
      .map(source => {
        // Filter out bad Destinations
        // Check every DestinationID defined in the Source Config against the Destinations LoadMap
        source.config.destinations = source.config.destinations.filter(destId => {
          let hasDest = !!this._loadMap.destinations[destId];

          if (!hasDest) {
            Logger.error(
              `Destination ID "${destId}" defined in [${source.id}] ${source.name} is not defined as a valid Destination Descriptor ID!`
            );
          }

          return hasDest;
        });

        // If we don't have any destinations, we don't want to import this at all
        return 0 !== source.config.destinations.length ? source : null;
      })
      .filter(v => !!v);
  }
}

module.exports = DescriptorImporter;

module.exports.BaseTrackerPath = BaseTrackerPath;
