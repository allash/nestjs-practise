import { UserMapper } from '../user.mapper';
import { UserRepository } from '../../db/repositories/user.repository';
import { UserService } from '../user.service';
import { UserController } from '../user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { DtoGetUsersResponse } from '../dto/response/dto.get.users.response';
import * as uuid from 'uuid';

// describe('UserController', () => {

//     let userController: UserController;
//     let userService: UserService;

//     beforeEach(() => {
//         userService = new UserService(new UserRepository(), new UserMapper());
//         userController = new UserController(userService);
//     });

//     describe('', () => {
//         const result = new Array(
//             new DtoGetUsersResponse(uuid.v4(), 'name1', 1),
//             new DtoGetUsersResponse(uuid.v4(), 'name2', 2),
//             new DtoGetUsersResponse(uuid.v4(), 'name3', 3),
//         );

//         //jest.spyOn(userService, 'getUsers').mockImplementation(() => result)
//     });
// });
