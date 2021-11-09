const config = {
  name: 'Hard Drive Deals',
  source: {
    type: 'rss',
    data: {
      feed: 'https://www.reddit.com/r/buildapcsales/search.rss?q=flair_name%3A%22SSD%22&restrict_sr=1&sort=new',
      predicate: entry => true
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
