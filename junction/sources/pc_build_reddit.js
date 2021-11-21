const ComplexSearchSettings_PC = require('../searchTerms/pc_gear');

const config = {
  name: 'General PC Deals',
  type: 'rss',
  destinations: [
    'discord_pc'
    // 'twitter_deals'
  ],
  extraOptions: {
    feed: 'https://www.reddit.com/r/buildapcsales/.rss?sort=new&limit=500'
  },
  predicate: ComplexSearchSettings_PC
};

module.exports = config;
