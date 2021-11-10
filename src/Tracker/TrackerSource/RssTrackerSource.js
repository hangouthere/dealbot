const RSSParser = require('rss-parser');

const TrackerSource = require('./TrackerSource');

const Parser = new RSSParser();

class RssTrackerSource extends TrackerSource {
  get feedUrl() {
    return this.config?.data.feed;
  }

  get items() {
    return this.data?.items;
  }

  // @ts-ignore (Silly typescript-only error about types not matching base class)
  async hydrate() {
    return Parser.parseURL(this.feedUrl);
  }
}

module.exports = RssTrackerSource;
