const { bs } = require('..');

module.exports = bs.model('Entries', {
  tableName: 'entries',
  hasTimestamps: true
});
