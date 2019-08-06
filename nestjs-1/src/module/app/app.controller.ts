import { AppConstants } from './../../config/constants';
import { ApiUseTags } from '@nestjs/swagger';
import { BaseController } from './../base/base.controller';
import { Controller, Get } from '@nestjs/common';
import { Public } from '../../guards/auth.guard';

@Controller(`${AppConstants.API_PREFIX}/app`)
@ApiUseTags('app')
export class AppController extends BaseController {

  @Public()
  @Get('/ping')
  ping(): string {
    return 'pong from circleci master!';
  }
}
