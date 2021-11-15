const RssSource = require('./Source/RssSource');

const HttpPostDestination = require('./Destination/HttpPostDestination');

const TRACKER_SOURCE_MAP = {
  rss: RssSource
};

const TRACKER_DESTINATION_MAP = {
  http_post: HttpPostDestination
};

class DescriptorFactory {
  constructor(config) {
    this.config = config;
  }

  static CreateFromDescriptorType(descriptorType, hydrateConfig) {
    return 'sources' === descriptorType ? this.CreateSource(hydrateConfig) : this.CreateDestination(hydrateConfig);
  }

  static CreateSource(hydrateConfig) {
    return this.Create(TRACKER_SOURCE_MAP, hydrateConfig);
  }

  static CreateDestination(hydrateConfig) {
    return this.Create(TRACKER_DESTINATION_MAP, hydrateConfig);
  }

  static Create(trackerMap, hydrateConfig) {
    const chosenTypeMap = trackerMap[hydrateConfig.type];

    if (!chosenTypeMap) {
      throw new Error(`[${hydrateConfig.name}] Invalid Source Type: ${hydrateConfig.type}`);
    }

    return new chosenTypeMap(hydrateConfig);
  }
}

module.exports = DescriptorFactory;
