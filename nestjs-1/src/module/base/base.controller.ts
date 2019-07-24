import { AuthGuard } from './../../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
export class BaseController { }
