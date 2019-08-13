import { Injectable } from '@nestjs/common';
import { DtoLoginResponse } from './dto/response/dto.login.response';

@Injectable()
export class SessionMapper {
  public toDtoLoginResponse(token: string): DtoLoginResponse {
    return new DtoLoginResponse(token);
  }
}
