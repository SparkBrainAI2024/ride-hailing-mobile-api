import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from '@vendia/serverless-express';
import express from 'express';

let cachedServer;

async function bootstrap() {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { cors: true }
  );

  await app.init();

  return (serverless as any).createServer(expressApp);
}

export default async function handler(req, res) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return (serverless as any).proxy(cachedServer, req, res);
}