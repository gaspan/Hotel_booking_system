// Update with your config settings.
const db = require('./config/database')

module.exports = {

  development: {
    client: 'mysql',
    connection: db.connection_knex
  },

  staging: {
    client: 'mysql',
    connection: db.connection_knex,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: db.connection_knex,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
