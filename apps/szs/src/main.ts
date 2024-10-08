/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { execSync } from 'child_process';
import { HttpExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  execSync('yarn prisma:db-push'); // Prisma의 db push 스크립트 실행

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'szs';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
