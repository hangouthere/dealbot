const { bs } = require('..');

const model = bs.model('Entries', {
  tableName: 'entries',
  hasTimestamps: true
});

model.getEntriesForDestinationId = destinationId =>
  this.where('destinationIds', 'like', `%${destinationId}%`).where('isNotified', false).fetchAll();

model.markNotified = entry => model.forge({ id: entry.id }).save({ isNotified: true });

module.exports = model;
