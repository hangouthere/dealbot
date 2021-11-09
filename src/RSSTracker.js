const RSSParser = require('rss-parser');

const Tracker = require('./Tracker');

const Parser = new RSSParser();

class RSSTracker extends Tracker {
  constructor(config) {
    super();

    this.config = config;
  }

  get predicate() {
    return this.config?.source.data.predicate;
  }

  get feedUrl() {
    return this.config?.source.data.feed;
  }

  async retrieveData() {
    this.data = await Parser.parseURL(this.feedUrl);
  }

  get items() {
    return this.data?.items;
  }
}

module.exports = RSSTracker;
