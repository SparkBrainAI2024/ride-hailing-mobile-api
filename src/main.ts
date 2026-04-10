import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PORT } from "./config";
import {
  NestExpressApplication,
  ExpressAdapter,
} from "@nestjs/platform-express";
import { HttpExceptionFilter } from "./common/exceptions/error.exception";
import { join } from "path";
import * as compression from "compression";
import helmet from "helmet";
import * as express from "express";

const server = express();
let app: NestExpressApplication;

async function bootstrap() {
  if (app) return app;
  const appOptions = { cors: true };

  app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    appOptions,
  );

  app.enableCors({
    origin: [
      "https://ridehailing.com",
      "https://www.ridehailing.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
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

  return app;
}

if (process.env.NODE_ENV !== "production") {
  bootstrap().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

export default async function handler(req, res) {
  await bootstrap();
  return server(req, res);
}
