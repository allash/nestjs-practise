import { createParamDecorator } from '@nestjs/common';

export const CurrentSession = createParamDecorator((data, req) => req.session);
