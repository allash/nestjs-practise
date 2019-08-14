import { RedisConfig } from './redis.config';
// tslint:disable-next-line:no-var-requires
const asyncRedis = require('async-redis');

import { Logger } from '@nestjs/common';
import { RedisConstants } from './redis.constants';

let client!: any;
const logger = new Logger('RedisProviders');
const config = new RedisConfig();

export const RedisProviders = [
  {
    provide: RedisConstants.REDIS_CONNECTION,
    useFactory: async () => {
      if (client != null) {
        return client;
      }

      const workerId = process.env.JEST_WORKER_ID
        ? +process.env.JEST_WORKER_ID
        : 0;

      logger.debug(
        `Creating RedisKeyStore connection with workerId: ${workerId}...`,
      );

      client = await new Promise((resolve, reject) => {
        let internalClient: any;
        internalClient = asyncRedis.createClient({
          host: config.host,
          port: config.port,
          db: 1 + workerId,
          password: config.password,
        });

        if (internalClient == null) {
          reject();
          throw new Error('Cannot get redis client, this should not happen');
        }

        internalClient.on('error', (err: any) => {
          reject();
          logger.error(err);
          throw new Error(
            'redis.providers.ts: error on redis connection: ' + err,
          );
        });

        internalClient.on('connect', () => {
          logger.debug('RedisKeyStore connection successfully created...');
          resolve(internalClient);
        });
      });

      return client;
    },
  },
];
