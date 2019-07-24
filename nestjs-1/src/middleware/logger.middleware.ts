import { NestMiddleware, Injectable } from '@nestjs/common';
import { NextFunction } from 'connect';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //console.log('request: ' + res.json);
        next();
    }
}
