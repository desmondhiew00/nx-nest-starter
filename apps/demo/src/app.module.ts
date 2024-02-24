import { Module } from '@nestjs/common';
import { AwsS3Module } from 'nestlibs-aws-s3';
import { JwtAuthModule } from 'nestlibs-jwt-auth';
import { LoggerModule } from 'nestlibs-winston-logger';

import { GqlModule } from '@app/core';
import { PrismaModule, extendedClient } from '@app/db';
import { PrismaClient } from '@prisma/client';
import { UserModule } from './modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot('demo'),
    PrismaModule,
    JwtAuthModule.forRoot('main-auth', {
      accessTokenSecret: 'secret',
      refreshTokenSecret: 'secret'
    }),
    GqlModule.forRoot(extendedClient as unknown as PrismaClient),
    AwsS3Module.forRoot({
      prefix: 'test',
      region: process.env['AWS_REGION'],
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      bucketName: process.env['AWS_S3_BUCKET']
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
