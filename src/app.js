const TrackerManager = require('./TrackerManager');

const getFeeds = async () => {
  const mgrTracker = new TrackerManager();

  const trackers = await mgrTracker.loadTrackers();

  const hydratedTrackers = await mgrTracker.hydrateTrackers(trackers);

  const promises = hydratedTrackers.map(mgrTracker.processRSS.bind(mgrTracker));

  Promise.all(promises);
};

getFeeds();
