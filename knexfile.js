// @ts-ignore
const path = require('path');

//! FIXME - Need to establish staging/production directories, need to statically copy them to dist build!

const knexBase = path.join(process.cwd(), 'src', 'db', 'knex');
const distBase = path.join(process.cwd(), 'dist');

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      // @ts-ignore
      filename: path.join(distBase, 'dev.sqlite3')
    },
    migrations: {
      // @ts-ignore
      directory: path.join(knexBase, 'migrations')
    },
    seeds: {
      // @ts-ignore
      directory: path.join(knexBase, 'seeds')
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
