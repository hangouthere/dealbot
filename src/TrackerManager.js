const fs = require('fs/promises');
const path = require('path');
const fetch = require('node-fetch');

//!FIXME Remove?
const result = require('lodash.result');
const RSSTracker = require('./RSSTracker');

const PATH_TRACKERS = process.env.PATH_TRACKERS || 'trackers';

module.exports = class TrackerManager {
  constructor() {}

  async loadTrackers() {
    const files = await fs.readdir(PATH_TRACKERS);

    return files
      .map(file => require(path.join(process.cwd(), PATH_TRACKERS, file)))
      .map(rawTracker => new RSSTracker(rawTracker));
  }

  async hydrateTrackers(trackers) {
    return Promise.all(
      trackers.map(async tracker => {
        await tracker.retrieveData();
        return tracker;
      })
    );
  }

  processRSS(tracker) {
    const triggeredPredicateItems = tracker.items.filter(tracker.predicate);

    console.log(
      `Tracker: ${tracker.name}\t\tItems: ${tracker.items.length}\t\tPredicated: ${triggeredPredicateItems.length}`
    );

    const updates = triggeredPredicateItems.map(item =>
      this.postToDiscord(tracker.config.destination.data.webhookURL, item)
    );

    return Promise.all(updates);
  }

  postToDiscord(webhookURL, item) {
    console.log('Posting: ' + item.title);
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
