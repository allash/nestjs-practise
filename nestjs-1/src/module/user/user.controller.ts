import { UserNamePipe } from './../../pipe/username.pipe';
import { RolesGuard, NeedRight } from '../../guards/auth.guard';
import { UserService } from './user.service';
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { DtoGetUsersResponse } from './dto/response/dto.get.users.response';
import { DtoCreateUserRequest } from './dto/request/dto.create.user.request';
import { FileInterceptor } from '@nestjs/platform-express';
import multer = require('multer');
import { ApiUseTags } from '@nestjs/swagger';
import { Right } from '../../enum/right.enum';

@Controller('users')
@ApiUseTags('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<DtoGetUsersResponse[]> {
    return await this.userService.getUsers();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: DtoCreateUserRequest) {
    await this.userService.createUser(dto);
  }

  @Get('/test-forbidden')
  async forbidden() {
    return this.userService.testForbidden();
  }

  @Get('/test-not-found')
  async testNotFoundCat() {
    return this.userService.testUserNotFound();
  }

  @Get('/test-right')
  @NeedRight(Right.CAN_GET_USERS)
  async testCanGetUsers(): Promise<boolean> {
    return true;
  }

  @Get('/:username')
  @UsePipes(new UserNamePipe())
  async getUserByName() {
    return 'name';
  }

  @Post('/disk-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
      }),
    }),
  )
  async uploadFileToDisk(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post('/memory-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage()
    })
  )
  async uploadDiskToMemory(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
