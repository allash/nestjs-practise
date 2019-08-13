import { RedisTestConstants } from '../redis.test.constants';
import { flushRedis } from '../../../__test__/utilities';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import { RedisService } from '../redis.service';
import { RedisModule } from '../redis.module';
import wait from '../../../__test__/wait';
import uuid = require('uuid');

describe.skip('Redis parallel test', () => {
  let context: TestContext;
  let redisService: RedisService;
  const WAIT_TIME = 10000;

  beforeAll(async () => {
    context = await getContext(true);
    redisService = await context.app
      .select(RedisModule)
      .get<RedisService>(RedisService);
  });

  beforeEach(async () => {
    jest.setTimeout(WAIT_TIME + 1000);
    await Promise.all([flushRedis(context.app)]);
  });

  it('expect created token 1', async () => {
    const tokenValue = uuid.v4();
    await redisService.set(RedisTestConstants.TOKEN_3, tokenValue);

    await wait(WAIT_TIME);

    const val3 = await redisService.get(RedisTestConstants.TOKEN_3);
    expect(tokenValue).toEqual(val3);

    // this tokens saved in another workers, so we're not expecting them here
    const val1 = await redisService.get(RedisTestConstants.TOKEN_1);
    expect(val1).toBeNull();

    const val2 = await redisService.get(RedisTestConstants.TOKEN_2);
    expect(val2).toBeNull();
  });
});
