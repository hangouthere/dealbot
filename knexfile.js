// @ts-ignore
const path = require('path');

//! FIXME - Need to establish staging/production directories, need to statically copy them to dist build!

const procBasePath = process.cwd();
const knexBase = path.join(procBasePath, 'knex');
const devBasePath = path.join(procBasePath, 'dist', 'dev.sqlite3');
const prodBasePath = path.join(procBasePath, 'db', 'prod.sqlite3');

console.log(`Using knexBase: ${knexBase}`);

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      // @ts-ignore
      filename: devBasePath
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

  productionOrig: {
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

module.exports.production = {
  ...module.exports.development,

  connection: {
    // @ts-ignore
    filename: prodBasePath
  }
};
