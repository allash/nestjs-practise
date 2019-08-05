const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;
const parse = require('pg-connection-string').parse;

const config = {
    "type": "postgres",
    "host": "localhost",
    "port": 8001,
    "username": "demo",
    "password": "demo",
    "database": "demo",
    "schema": "public",
    "entities": ["src/**/*.entity{.ts,.js}"],
    "synchronize": false,
    "migrationsRun": true,
    "migrations": ["src/migrations/**/*{.ts,.js}"],
    "cli": {
      "migrationsDir": "src/migrations"
    },
    "namingStrategy": new SnakeNamingStrategy()
  }

  if (process.env.NODE_ENV == 'test') { 
    config.schema = "test";
    config.migrationsRun = false;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl != null) {
    const options = parse(databaseUrl);

    config.host = options.host;
    config.port = options.port;
    config.username = options.user;
    config.password = options.password;
    config.database = options.database;
  }

  module.exports = config;