// Funny name is so that this actually loads LAST in the system
// It should cause a DuplicateEntry Warning

const config = {
  id: 'discord_pc', // Should collide with discord_pc.js and not be included!
  name: 'Duplicate Destination ID Entry',
  type: 'http_post',
  template: "doesn't matter",
  data: {
    feed: 'https://www.reddit.com/r/buildapcsales/.rss?sort=new'
  }
};

module.exports = config;
