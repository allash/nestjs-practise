import { ErrorFilter } from './filter/error.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await app.listen(3001);
}
bootstrap();
