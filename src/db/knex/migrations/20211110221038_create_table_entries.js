const TABLE_NAME = 'entries';

exports.up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments();
    table.timestamps();
    table.blob('error');
    table.string('idHash').unique();
    table.text('entryUrl').unique();
    table.blob('content');
    table.boolean('isNotified');
    //destinationIds = stringified array of items (ie, "'hello', 'world'")
    table.string('destinationIds');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(TABLE_NAME);
};
