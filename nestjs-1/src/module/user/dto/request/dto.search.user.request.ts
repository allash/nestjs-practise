import { IsString, MinLength, IsUUID } from 'class-validator';

export class DtoSearchUserRequest {
  @IsString()
  @MinLength(3)
  public query: string;

  public socketId: string;
}
