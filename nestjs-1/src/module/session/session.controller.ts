import { DtoLoginRequest } from './dto/request/dto.login.request';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { DtoLoginResponse } from './dto/response/dto.login.response';

@Controller('sessions')
@ApiUseTags('sessions')
export class SessionController {

    constructor(private readonly sessionService: SessionService) { }

    @Post('/login')
    async login(@Body() dto: DtoLoginRequest): Promise<DtoLoginResponse> {
        return await this.sessionService.login(dto);
    }
}
