import { DtoCreateUserRequest } from './dto/request/dto.create.user.request';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() body: DtoCreateUserRequest) {
        await this.userService.createUser(body);
    }

    @Get()
    async getUsers() { 
        await this.userService.getUsers();
    }
}
