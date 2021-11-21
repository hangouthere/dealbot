const md5 = require('md5');
const RSSParser = require('rss-parser');

const DescriptorSource = require('./DescriptorSource');

const Parser = new RSSParser();

class RssSource extends DescriptorSource {
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
    return this.config?.extraOptions.feed;
  }

  // @ts-ignore (Silly typescript-only error about types not matching base class)
  async performHydration() {
    return Parser.parseURL(this.feedUrl);
  }
}

module.exports = RssSource;
