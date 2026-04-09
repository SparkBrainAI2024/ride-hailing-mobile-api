import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';

const expressApp = express();
let isInitialized = false;

const bootstrap = async () => {
  if (!isInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: false }
    );
    app.enableCors();
    await app.init();
    isInitialized = true;
  }
  return expressApp;
};

export default async (req: any, res: any) => {
  const server = await bootstrap();
  server(req, res);
};