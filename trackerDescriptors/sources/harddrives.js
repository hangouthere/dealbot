const config = {
  name: 'Hard Drive Deals',
  type: 'rss',
  destinations: ['discord_gen_pc'],
  data: {
    feed: 'https://www.reddit.com/r/buildapcsales/search.rss?q=flair_name%3A%22SSD%22&restrict_sr=1&sort=new',
    predicate: entry => true
  }
};

module.exports = config;
