

const config = {
    "type": "postgres",
    "host": "localhost",
    "port": 7001,
    "username": "flyway_demo",
    "password": "flyway_demo",
    "database": "flyway_demo",
    "schema": "public",
    "entities": ["src/**/*.entity{.ts,.js}"],
    "synchronize": false,
    "migrationsRun": false
  }

  if (process.env.NODE_ENV == 'test') { 
    config.schema = "test";
    config.synchronize = true;
    config.migrationsRun = false;
  }

  module.exports = config;