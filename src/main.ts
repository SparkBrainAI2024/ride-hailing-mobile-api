import 'tsconfig-paths/register'; // resolves src/* imports

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/exceptions/error.exception';
import { join } from 'path';
import * as compression from 'compression';
import helmet from 'helmet';
import express from 'express';
// use require to avoid missing type declarations for @vendia/serverless-express
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serverlessExpress: any = require('@vendia/serverless-express');

const server = express();
let cachedServer: any;

async function bootstrapServerless() {
  if (!cachedServer) {
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(server),
    );

    // CORS
    app.enableCors({
      origin: [
        'https://ridehailing.com',
        'https://www.ridehailing.com',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      credentials: true,
    });

    // Global prefix & filters
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpExceptionFilter());

    // Security & performance
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
    app.use(compression());

    // Static files
    app.useStaticAssets(join(__dirname, '..', 'files'), {
      prefix: '/files/',
    });

    // Init app
    await app.init();

    // Wrap with serverless
    cachedServer = serverlessExpress({ app: server });
  }

  return cachedServer;
}

// Vercel handler
export default async function handler(req: any, res: any) {
  const server = await bootstrapServerless();
  return server(req, res);
}