import { DtoLoginRequest } from './dto/request/dto.login.request';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { DtoLoginResponse } from './dto/response/dto.login.response';
import { Public } from '../../guards/auth.guard';

@Controller('sessions')
@ApiUseTags('sessions')
export class SessionController {

    constructor(private readonly sessionService: SessionService) { }

    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: DtoLoginRequest): Promise<DtoLoginResponse> {
        return await this.sessionService.login(dto);
    }
}
