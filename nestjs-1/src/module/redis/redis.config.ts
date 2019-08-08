const redisUrl = require('redis-url');

export class RedisConfig {
  public db!: number | null;
  public host!: string | null;
  public port!: number | null;
  public password!: string | null;

  private url!: string | null;

  constructor() {
    this.url = process.env.REDIS_URL || 'redis://localhost:6379';

    const config = redisUrl.parse(this.url);
    this.db = config.database || 0;
    this.host = config.hostname || '';
    this.port = config.port || 6379;
    this.password = config.password;
  }
}
