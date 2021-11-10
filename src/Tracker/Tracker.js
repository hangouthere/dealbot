const RssTrackerSource = require('./TrackerSource/RssTrackerSource');

const DiscordTrackerDestination = require('./TrackerDestination/DiscordTrackerDestination');

const TRACKER_SOURCE_MAP = {
  rss: RssTrackerSource
};

const TRACKER_DESTINATION_MAP = {
  discord: DiscordTrackerDestination
};

class Tracker {
  config = null;

  source = null;
  destination = null;

  get name() {
    return this.config?.name;
  }

  get sourceConfig() {
    return this.config?.source;
  }

  get destinationConfig() {
    return this.config?.destination;
  }

  get items() {
    return this.source?.items;
  }

  constructor(config) {
    this.config = config;
  }

  async hydrate() {
    this.source = this._hydrateType(TRACKER_SOURCE_MAP, this.sourceConfig);
    this.destination = this._hydrateType(TRACKER_DESTINATION_MAP, this.destinationConfig);

    this.source.data = await this.source.hydrate();
  }

  _hydrateType(trackerMap, hydrateConfig) {
    const chosenTypeMap = trackerMap[hydrateConfig.type];

    if (!chosenTypeMap) {
      throw new Error(`[${this.name}] Invalid Source Type: ${hydrateConfig.type}`);
    }

    return new chosenTypeMap(hydrateConfig);
  }
}

module.exports = Tracker;
