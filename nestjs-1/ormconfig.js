

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
    }
  }

  if (process.env.NODE_ENV == 'test') { 
    config.schema = "test";
    config.synchronize = true;
    config.migrationsRun = false;
  }

  module.exports = config;