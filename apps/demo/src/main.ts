/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestAppFactory } from '@app/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestAppFactory.create(AppModule);
  app.graphql = true;
  app.applyCommonMiddleware();
  app.applySwagger();
  app.start();
}

bootstrap();
