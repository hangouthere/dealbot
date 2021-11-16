const SimpleSearch = require('../../src/Descriptor/Source/Predicates/SimpleSearch');

const SimpleSearchSettings = {
  // type: 'simpleSearch',
  blacklist: ''.toLowerCase().split(' '),
  whitelist: ['shopvac', 'shop vac', 'drill', 'impact', 'Dash Cam', 'chainsaw']
};

const config = {
  name: 'Garage Toy Deals',
  type: 'rss',
  destinations: ['discord_garage'],
  data: {
    feed: 'https://slickdeals.net/newsearch.php?rss=1&pp=200&sort=newest&forumid%5B%5D=30&forumid%5B%5D=9&forumid%5B%5D=25&forumid%5B%5D=4&forumid%5B%5D=8&forumid%5B%5D=10&forumid%5B%5D=13&forumid%5B%5D=38&forumid%5B%5D=39&forumid%5B%5D=53&forumid%5B%5D=54&forumid%5B%5D=41&forumid%5B%5D=44&forumid%5B%5D=166',
    predicate: SimpleSearch(SimpleSearchSettings)
  }
};

module.exports = config;
