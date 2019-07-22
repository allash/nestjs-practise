import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(err: string = '', params: string = '') {
    super(
      {
        err,
        params,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
