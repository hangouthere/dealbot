const md5 = require('md5');
const RSSParser = require('rss-parser');

const TrackerSource = require('./DescriptorSource');

const Parser = new RSSParser();

class RssTrackerSource extends TrackerSource {
  get items() {
    return this.data?.items;
  }

  getEntryHash(entry) {
    const dataCopy = { ...entry };

    return md5(JSON.stringify(dataCopy));
  }

  getEntryName(entry) {
    return entry.title;
  }

  getEntryUrl(entry) {
    return entry.link;
  }

  get feedUrl() {
    return this.config?.data.feed;
  }

  // @ts-ignore (Silly typescript-only error about types not matching base class)
  async performHydration() {
    return Parser.parseURL(this.feedUrl);
  }
}

module.exports = RssTrackerSource;
