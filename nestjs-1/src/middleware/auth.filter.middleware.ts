import {
  UserRepository,
  DtoUserGrantedAuthority,
} from './../module/db/repositories/user.repository';
import { AppConstants } from './../config/constants';
import { DtoSession } from './../shared/dto/dto.session';
import { SessionRepository } from './../module/db/repositories/session.repository';
import { NestMiddleware, Injectable, Inject, Logger } from '@nestjs/common';
import { DbConstants } from '../module/db/db.constants';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';

@Injectable()
export class AuthFilterMiddleware implements NestMiddleware {
  constructor(
    @Inject(DbConstants.SESSION_REPOSITORY)
    private readonly sessionRepo: SessionRepository,
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}

  private readonly logger = new Logger(AuthFilterMiddleware.name);

  public async use(req: Request, res: Response, next: NextFunction) {
    const authToken: string = req.headers[AppConstants.X_AUTH_TOKEN] as string;

    if (authToken) {
      const session = await this.sessionRepo.findOneByToken(authToken);
      if (session != null) {
        const user = await this.userRepo.findUserWithGrantedAuthorities(session.userId);
        this.logger.debug('User: ' + (user ? user.email : 'no user'));

        if (user != null) {
          const rights = user ? this.getRights(user) : [];
          this.logger.debug('Rights: ');
          this.logger.debug(rights);

          // const result = await this.userRepo.find({ select: ['email'],  relations: ['userRoles', 'userRoles.role', 'userRoles.role.roleRights']});
          const currentSession: DtoSession = {
            userId: user.id,
            userEmail: user.email,
            sessionToken: authToken,
            rights,
          };
          (req as any).session = currentSession;
        }
      }
    }

    next();
  }

  private getRights(dto: DtoUserGrantedAuthority): string[] {
    const rights = new Set<string>();

    dto.userRoles.forEach(e => {
      if (e.role) {
        e.role.roleRights.forEach(d => {
          if (d.right) {
            rights.add(d.right.name);
          }
        });
      }
    });

    return Array.from(rights.values());
  }
}
