export function connect(redisUrl: any): any;
export function createClient(redisUrl: any): any;
export function parse(url: string): RedisParseResult;
export class RedisParseResult {
  database: number;
  hostname: string;
  port: number;
  password: string;
}
