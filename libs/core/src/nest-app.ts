/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus, INestApplication, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import helmet from 'helmet';
import signale from 'signale';
import { initDayjs } from './dayjs';

initDayjs();

const isProduction = process.env['NODE_ENV'] === 'production';

export class NestAppFactory {
  static async create(nestModule: Class, options?: NestApplicationOptions): Promise<NestApp> {
    const app = await NestFactory.create(nestModule, options);
    return new NestApp(app);
  }
}

export class NestApp {
  app: INestApplication;
  port = Number(process.env['PORT'] || 3000);
  globalPrefix = 'api';
  swagger = false;
  graphql = false;

  constructor(app: INestApplication) {
    this.app = app;
    this.app.setGlobalPrefix(this.globalPrefix);
  }

  private applyEmptyContentMiddleware() {
    const routes = ['/favicon.ico', '/robots.txt'];
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (routes.includes(req.originalUrl)) {
        res.status(204).end();
      } else {
        next();
      }
    });
  }

  private applyCorsMiddleware() {
    this.app.enableCors({
      credentials: true,
      exposedHeaders: 'Content-Disposition'
    });
  }

  private applySecurityMiddleware() {
    this.app.use(
      helmet({
        crossOriginEmbedderPolicy: isProduction,
        contentSecurityPolicy: isProduction
      })
    );
  }

  private applyCookieParserMiddleware() {
    this.app.use(cookieParser());
  }

  private applyGlobalPipes() {
    this.app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
        transform: true,
        forbidUnknownValues: false
      })
    );
  }

  private applyGraphQLUploadMiddleware() {
    this.app.use('/graphql', (req: Request, res: Response, next: NextFunction) => {
      graphqlUploadExpress({ maxFileSize: 50000000, maxFiles: 10 })(req, res, next);
    });
  }

  useGraphql() {
    this.graphql = true;
  }

  applyCommonMiddleware() {
    this.applyEmptyContentMiddleware();
    this.applyCorsMiddleware();
    this.applySecurityMiddleware();
    this.applyCookieParserMiddleware();
    this.applyGlobalPipes();
    this.applyGraphQLUploadMiddleware();
  }

  applySwagger(options?: InitSwaggerOptions) {
    if (!this.app) throw new Error('NestApplication is not created yet');
    const { title = 'API', description, path = 'api', version = '1.0', tags = [] } = options || {};

    const config = new DocumentBuilder();

    config.setTitle(options?.title || title);
    if (description) config.setDescription(description);

    tags.map((tag) => {
      config.addTag(tag.name, tag.description);
    });

    config.setVersion(version);
    config.addBearerAuth({ in: 'header', type: 'http', bearerFormat: 'JWT' });

    const document = SwaggerModule.createDocument(this.app, config.build());
    SwaggerModule.setup(path, this.app, document);

    this.swagger = true;
  }

  async start() {
    if (!this.app) throw new Error('NestApplication is not created yet');
    await this.app.listen(this.port);
    this.logApplicationInfo();
  }

  private logApplicationInfo() {
    const swaggerUrl = this.swagger ? `http://localhost:${this.port}/api` : null;
    const gqlPlaygroundUrl = this.graphql ? `http://localhost:${this.port}/graphql` : null;

    signale.log();
    signale.start(`🚀 Application is running on: http://localhost:${this.port}/${this.globalPrefix}`);
    if (swaggerUrl) signale.start(`🚀 Swagger is running on: ${swaggerUrl}`);
    if (gqlPlaygroundUrl) signale.start(`🚀 GraphQL Playground is running on: ${gqlPlaygroundUrl}`);
  }
}

type Class = new (...args: any[]) => any;
interface InitSwaggerOptions {
  title: string;
  description?: string;
  path?: string; // swagger url
  version?: string;
  tags?: { name: string; description?: string }[];
}
