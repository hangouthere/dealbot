const RssSource = require('./Source/RssSource');

const HttpPostDestination = require('./Destination/HttpPostDestination');

const DESCRIPTOR_SOURCE_MAP = {
  rss: RssSource
};

const DESCRIPTOR_DESTINATION_MAP = {
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
    return this.Create(DESCRIPTOR_SOURCE_MAP, hydrateConfig);
  }

  static CreateDestination(hydrateConfig) {
    return this.Create(DESCRIPTOR_DESTINATION_MAP, hydrateConfig);
  }

  static Create(descriptorMap, hydrateConfig) {
    const chosenTypeMap = descriptorMap[hydrateConfig.type];

    if (!chosenTypeMap) {
      return new Error(`[${hydrateConfig.name}] Invalid Source Type: ${hydrateConfig.type}`);
    }

    return new chosenTypeMap(hydrateConfig);
  }
}

module.exports = DescriptorFactory;
