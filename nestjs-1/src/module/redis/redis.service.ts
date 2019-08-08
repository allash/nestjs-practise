import { Injectable, Inject } from '@nestjs/common';
import { RedisConstants } from './redis.constants';

@Injectable()
export class RedisService {

    constructor(
        @Inject(RedisConstants.REDIS_CONNECTION) private readonly connection: any
    ) {}

    public async get(key: string) {
      return this.connection.get(key);
    }

    public async set(key: string, value: any) {
      return this.connection.set(key, value);
    }

    public async del(key: string) {
      return this.connection.del(key);
    }

    public async flush() {
      return this.connection.flushall();
    }
}
