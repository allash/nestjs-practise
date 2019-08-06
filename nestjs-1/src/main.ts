import { ErrorFilter } from './filter/error.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  // init swagger
  const options = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('Users API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  // init cors
  const corsOptions: CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-xsrf-token', 'x-auth-token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: ['*'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
