import { ErrorFilter } from './filter/error.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initExpress } from './initializer';
import { ExpressAdapter } from '@nestjs/platform-express';

const logger = new Logger('Main');

async function bootstrap() {
  const server = await initExpress();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    {},
  );

  app.useWebSocketAdapter(new WsAdapter(app.getHttpServer()));
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // init swagger
  const options = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('Users API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  const port = process.env.PORT || 3001;
  logger.log(`App started on port ${port}`);

  await app.listen(port);
}

bootstrap();
