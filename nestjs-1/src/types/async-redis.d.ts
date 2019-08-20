export = index;

declare function index(args: any): any;
declare namespace index {
  function createClient(parameters: IRedisClientParams): IRedisClient;
}

export interface IRedisClientParams {
  host: string | null;
  port: number | null;
  db: number | null;
  password?: string | null;
}

export interface IRedisClient {
  on: (event: string, callBack: (error: any) => void) => void;
}
