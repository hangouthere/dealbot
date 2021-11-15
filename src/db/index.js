// @ts-nocheck
const knex = require('knex');
const bookshelf = require('bookshelf');
const knexfile = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';

const knexInstance = knex(knexfile[environment]);

exports.knex = knexInstance;
exports.bs = bookshelf(knexInstance);
exports.closeDB = knexInstance.destroy.bind(knexInstance);
