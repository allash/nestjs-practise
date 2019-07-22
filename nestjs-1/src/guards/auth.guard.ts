import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Right } from '../enum/right.enum';

const METADATA_KEYS: { [key: string]: string } = {
    needRight: 'need_right',
};

@Injectable()
export class RolesGuard implements CanActivate {
    public rights: string[] = new Array(Right.CAN_GET_USERS);
    constructor(private readonly reflector: Reflector) { }

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const handler = context.getHandler();

        const reflectNeedRight = this.reflector.get(METADATA_KEYS.needRight, handler);

        if (reflectNeedRight) {
            const hasRight = this.rights.indexOf(reflectNeedRight) > -1;
            if (!hasRight) {
                throw new UnauthorizedException();
            }
            return true;
        }

        return true;
    }
}

export const NeedRight = (right: string) => SetMetadata(METADATA_KEYS.needRight, right);
