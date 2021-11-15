// Funny name is so that this actually loads LAST in the system
// It should cause a DuplicateEntry Warning

const config = {
  id: 'discord_gen_pc', // Should collide with ram.js and not be included!
  name: 'Tracker Name for Specific Deal(s)',
  destinations: ['discord_gen_pc'],
  type: 'http_post',
  data: {
    feed: 'https://www.reddit.com/r/buildapcsales/.rss?sort=new',
    predicate: entry => true
  }
};

module.exports = config;
