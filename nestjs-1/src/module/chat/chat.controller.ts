import { ChatService } from './chat.service';
import { BaseController } from './../base/base.controller';
import { AppConstants } from './../../config/constants';
import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { Public } from '../../guards/auth.guard';

@Controller(`${AppConstants.API_PREFIX}/chat`)
export class ChatController extends BaseController {
  constructor(private readonly chatService: ChatService) {
    super();
  }

  @Public()
  @Post('/join')
  @HttpCode(HttpStatus.OK)
  async join(@Body() req: { socketId: string; username: string }) {
    this.chatService.joinChat(req.socketId, req.username);
  }

  @Public()
  @Post('/message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() req: { socketId: string; message: string }) {
    this.chatService.sendMessage(req.socketId, req.message);
  }

  // PubSub
  @Public()
  @Post('/pubsub-join')
  @HttpCode(HttpStatus.OK)
  async pubSubJoin(@Body() req: { socketId: string; username: string }) {
    this.chatService.pubSubJoinChat(req.socketId, req.username);
  }
}
