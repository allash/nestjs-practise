export function parse(url: string): IRedisParseResult;
export interface IRedisParseResult {
  database: number;
  hostname: string;
  port: number;
  password: string;
}
