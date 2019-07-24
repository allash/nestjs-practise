import { UserRepository } from './../module/db/repositories/user.repository';
import { AppConstants } from './../config/constants';
import { DtoSession } from './../shared/dto/dto.session';
import { SessionRepository } from './../module/db/repositories/session.repository';
import { NestMiddleware, Injectable, Inject } from '@nestjs/common';
import { DbConstants } from '../module/db/db.constants';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthFilterMiddleware implements NestMiddleware {
  constructor(
    @Inject(DbConstants.SESSION_REPOSITORY)
    private readonly sessionRepo: SessionRepository,
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}

  public async use(req: Request, res: Response, next: NextFunction) {
    const authToken: string = req.headers[AppConstants.X_AUTH_TOKEN] as string;

    if (authToken) {
      const session = await this.sessionRepo.findOneByToken(authToken);
      if (session != null) {
        const user = await this.userRepo.findOne(session.userId);
        if (user != null) {
          const currentSession: DtoSession = {
            userId: user.id,
            userEmail: user.email,
            sessionToken: authToken,
            rights: [],
          };
          (req as any).session = currentSession;
        }
      }
    }

    next();
  }
}
