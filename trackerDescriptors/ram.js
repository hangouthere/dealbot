const config = {
  name: 'RAM Deals',
  source: {
    type: 'rss',
    data: {
      feed: 'https://www.reddit.com/r/buildapcsales/.rss?restrict_sr=1&sort=new',

      //predicate: "search(ddr ecc !non-ecc)"
      predicate: entry => {
        const search = `${entry.title} ${entry.content}`.toLowerCase();

        return search.includes('ddr');
      }
    }
  },
  destination: {
    type: 'discord',
    data: {
      webhookURL:
        'https://discord.com/api/webhooks/907756988740554833/DrufzQ61uMyfXFvgnIkg5uvsnPahfd0UojJVUyxwLFBtFLXf2K2-01lLwnnBAuf6hFCP',
      template: entry => {}
    }
  }
};

module.exports = config;
