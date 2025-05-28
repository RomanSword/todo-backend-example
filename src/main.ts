import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет поля, не указанные в DTO
      forbidNonWhitelisted: true, // вызывает ошибку при наличии лишних полей
      transform: true // преобразует типы (например, строку '1' в число)
    })
  );

  app.use(cookieParser());

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('Документация для API управления задачами')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api - путь к UI

  await app.listen(3000);
}

bootstrap()
  .then(() => {
    console.log('App started!');
  })
  .catch(() => {
    console.log('App NOT started!');
  });
