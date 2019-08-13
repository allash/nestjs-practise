import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { DtoSession } from '../shared/dto/dto.session';

const METADATA_KEYS: { [key: string]: string } = {
  hasRight: 'has_right',
  authenticated: 'authenticated',
  public: 'public',
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    const req = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get(METADATA_KEYS.public, handler);
    if (isPublic) {
      return true;
    }

    const currentSession: DtoSession = req.session;
    if (!currentSession) {
      throw new UnauthorizedException();
    }

    const reflectHasRight = this.reflector.get(METADATA_KEYS.hasRight, handler);
    if (reflectHasRight) {
      const hasRight = currentSession.rights.indexOf(reflectHasRight) > -1;
      if (!hasRight) {
        throw new ForbiddenException();
      }
      return true;
    }

    return true;
  }
}

export const HasRight = (right: string) =>
  SetMetadata(METADATA_KEYS.hasRight, right);
export const Authenticated = () =>
  SetMetadata(METADATA_KEYS.authenticated, true);
export const Public = () => SetMetadata(METADATA_KEYS.public, true);
