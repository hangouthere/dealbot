const SimpleSearch = require('../../src/Descriptor/Source/Predicates/SimpleSearch');

const SimpleSearchSettings = {
  // type: 'simpleSearch',
  blacklist: '[fan] [motherboard] bundle prebuild prebuilt pre-build pre-built'.toLowerCase().split(' '),
  whitelist: '[ram] [ddr] [gpu] [aio] [laptop]'.toLowerCase().split(' ')
};

const config = {
  name: 'General PC Deals',
  type: 'rss',
  destinations: [
    'discord_gen_pc'
    // 'twitter_deals'
  ],
  data: {
    feed: 'https://www.reddit.com/r/buildapcsales/.rss?sort=new',
    predicate: SimpleSearch(SimpleSearchSettings)
  }
};

module.exports = config;
