const fs = require('fs/promises');
const path = require('path');
const fetch = require('node-fetch');

const RSSTracker = require('./TrackerSource/RssTrackerSource');
const Tracker = require('./Tracker');

const PATH_TRACKERS = process.env.PATH_TRACKERS || 'trackerDescriptors';

module.exports = class TrackerManager {
  constructor() {}

  async importTrackers() {
    const files = await fs.readdir(PATH_TRACKERS);

    return files
      .map(file => require(path.join(process.cwd(), PATH_TRACKERS, file)))
      .map(descriptor => new Tracker(descriptor));
  }

  async hydrateTrackers(trackers) {
    return Promise.all(
      trackers.map(async tracker => {
        try {
          await tracker.hydrate();

          // DB Update Feed with Hashed Data
        } catch (err) {
          // DB Update Feed with Error'd Data

          console.error(err);
        }

        return tracker;
      })
    );
  }

  processRSS(tracker) {
    const triggeredPredicateItems = tracker.items.filter(tracker.source.predicate);

    console.log(
      `Tracker: ${tracker.name}\t\tItems: ${tracker.items.length}\t\tPredicated: ${triggeredPredicateItems.length}`
    );

    const updates = triggeredPredicateItems.map(item =>
      this.postToDiscord(tracker.destinationConfig.data.webhookURL, item)
    );

    return Promise.all(updates);
  }

  postToDiscord(webhookURL, item) {
    console.log('Posting: ' + item.title);

    return;

    const discordTemplate = {
      content: 'Deal Item Found!',
      embeds: [
        {
          title: '>> View Deal <<',
          url: item.link,
          color: 3447787,
          footer: { text: 'Review Hardware Before Purchasing!' },
          author: { name: item.title }
        }
      ]
    };

    return fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordTemplate)
    })
      .then(async resp => {
        return resp.json();
      })
      .then(msg => console.log(msg));
  }
};
