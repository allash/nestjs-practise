import { Logger } from '@nestjs/common';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as url from 'url';

const logger = new Logger('InitExpress');

const applyCors = async (server: express.Application) => {
  const webUrl = 'http://localhost:3001';

  if (!webUrl) {
    throw new Error('initExpress.applyCors(): no weburl set in configuration');
  }

  const parsedUrl = new url.URL(webUrl);

  const corsOptions: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Content-Type',
      'Accept',
      'x-auth-token',
      'X-Locale',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: [parsedUrl.origin],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };

  server.use(cors(corsOptions));
  server.options('*', cors(corsOptions));
};

const allowEverything = async (server: express.Application) => {
    server.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
      });
};

export const initExpress = async () => {
  logger.debug('Starting express server...');

  const server = express();
  server.disable('x-powered-by');

  await applyCors(server);

  server.use('/', express.static('public'));

  server.use(
    helmet.frameguard({
      action: 'deny',
    }),
  );

  server.use((err: any, req: any, res: any, next: any) => {
    logger.error(err.stack);
    res.status(500).send('Server error');
  });

  return server;
};
