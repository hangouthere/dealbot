const ComplexSearchSettings_PC = require('../searchTerms/pc_gear');

const config = {
  name: 'General PC Deals 2',
  type: 'rss',
  destinations: ['discord_pc'],
  extraOptions: {
    feed: 'https://slickdeals.net/newsearch.php?rss=1&pp=500&sort=newest&forumid%5B%5D=30&forumid%5B%5D=9&forumid%5B%5D=25&forumid%5B%5D=4&forumid%5B%5D=8&forumid%5B%5D=10&forumid%5B%5D=13&forumid%5B%5D=38&forumid%5B%5D=39&forumid%5B%5D=53&forumid%5B%5D=54&forumid%5B%5D=41&forumid%5B%5D=44&forumid%5B%5D=166'
  },
  predicate: ComplexSearchSettings_PC
};

module.exports = config;
