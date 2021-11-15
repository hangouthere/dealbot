const config = {
  name: 'RAM Deals',
  type: 'rss',
  destinations: ['discord_gen_pc'],
  data: {
    feed: 'https://www.reddit.com/r/buildapcsales/.rss?restrict_sr=1&sort=new',

    //predicate: "search(ddr ecc !non-ecc)"
    predicate: entry => {
      const search = `${entry.title} ${entry.content}`.toLowerCase();

      return search.includes('ddr');
    }
  }
};

module.exports = config;
