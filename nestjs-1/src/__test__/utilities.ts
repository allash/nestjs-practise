import { Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const recreateSchema = async (connection: Connection) => {

  const schema = (connection.options as PostgresConnectionOptions).schema;

  try {
    await connection.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  } catch (err) {
    // intentionally left blank
  }

  try {
    await connection.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
  } catch (err) {
    // intentionally left blank
  }

  await connection.synchronize();
};
