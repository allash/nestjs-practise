import { BaseController } from './../base/base.controller';
import { AppConstants } from './../../config/constants';
import { UserNamePipe } from './../../pipe/username.pipe';
import { HasRight, Public } from '../../guards/auth.guard';
import { UserService } from './user.service';
import {
  Controller,
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
import { ApiUseTags, ApiImplicitHeader } from '@nestjs/swagger';
import { Right } from '../../enum/right.enum';
import { RightsEnum } from '../../config/rights.enum';

@Controller(`${AppConstants.API_PREFIX}/users`)
@ApiUseTags('users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  @HasRight(RightsEnum.CAN_READ_USERS)
  @ApiImplicitHeader({ name: AppConstants.X_AUTH_TOKEN, required: true, description: 'user session token' })
  async getUsers(): Promise<DtoGetUsersResponse[]> {
    return await this.userService.getUsers();
  }

  @Public()
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
  @HasRight(Right.CAN_GET_USERS)
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
