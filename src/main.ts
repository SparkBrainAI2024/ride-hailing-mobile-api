import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication, ExpressAdapter } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "./common/exceptions/error.exception";
import { join } from "path";
import * as compression from "compression";
import helmet from "helmet";
import serverlessExpress from "@vendia/serverless-express";
import express from "express";

const server = express();
let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(server),
    );

    app.enableCors({
      origin: [
        "https://ridehailing.com",
        "https://www.ridehailing.com",
        "http://localhost:3000",
      ],
      credentials: true,
    });

    app.setGlobalPrefix("api");
    app.useGlobalFilters(new HttpExceptionFilter());

    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      }),
    );

    app.use(compression());

    app.useStaticAssets(join(__dirname, "..", "files"), {
      prefix: "/files/",
    });

    await app.init();

    cachedServer = serverlessExpress({ app: server });
  }

  return cachedServer;
}

// ✅ FINAL FIX
export default async function handler(req, res) {
  const server = await bootstrap();
  return server(req, res);
}
