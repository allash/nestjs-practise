import { RolesGuard } from '../../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(RolesGuard)
export class BaseController {

}
