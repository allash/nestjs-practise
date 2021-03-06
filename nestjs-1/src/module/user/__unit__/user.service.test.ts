import { S3Service } from './../../../utils/s3.service';
import { UserFileRepository } from './../../db/repositories/user.file.repository';
import { anything, instance, mock, when } from 'ts-mockito';
import { UserMapper } from '../user.mapper';
import { UserRepository } from '../../db/repositories/user.repository';
import { UserService } from '../user.service';
import { DbUser } from '../../db/entities/user.entity';
import * as _ from 'lodash';

describe('user service', () => {
  let target: UserService;
  const mockUserRepo = mock(UserRepository);
  const mockUserFileRepo = mock(UserFileRepository);
  const mockS3Service = mock(S3Service);

  const users = new Array<DbUser>();

  beforeAll(() => {
    target = new UserService(
      instance(mockUserRepo),
      instance(mockUserFileRepo),
      new UserMapper(),
      instance(mockS3Service),
    );
  });

  describe('getUsers ', () => {
    beforeAll(() => {
      for (let i = 5; i > 0; i--) {
        const user = new DbUser();
        user.firstName = `user${i}`;
        user.email = `user${i}@mail.com`;
        user.password = '1234';

        users.push(user);
      }
    });

    it('should return a users list', async () => {
      when(mockUserRepo.find(anything())).thenResolve(users);

      const result = await target.getUsers();
      expect(result.length).toEqual(users.length);
    });
  });
});
