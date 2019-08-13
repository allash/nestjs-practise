import { UserRepository } from './../module/db/repositories/user.repository';
import { AppConstants } from './../config/constants';
import { DtoSession } from './../shared/dto/dto.session';
import { NestMiddleware, Injectable, Inject } from '@nestjs/common';
import { DbConstants } from '../module/db/db.constants';
import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';
import { DbUser } from '../module/db/entities/user.entity';
import { RedisService } from '../module/redis/redis.service';

@Injectable()
export class AuthFilterMiddleware implements NestMiddleware {
  constructor(
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  public async use(req: Request, res: Response, next: NextFunction) {
    const authToken: string = req.headers[AppConstants.X_AUTH_TOKEN] as string;
    if (authToken) {
      const userId = await this.redisService.get(authToken);
      if (userId != null) {
        const user = await this.userRepo.findUserWithGrantedAuthorities(userId);
        if (user != null) {
          const rights = user ? this.getRights(user) : [];

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

  private getRights(dto: DbUser): string[] {
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
