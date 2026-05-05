import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  NestExpressApplication,
  ExpressAdapter,
} from "@nestjs/platform-express";
import { join } from "path";
import compression from "compression";
import helmet from "helmet";
import express from "express";
import { HttpExceptionFilter } from "@libs/common";

const server = express();
let app: NestExpressApplication;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    { cors: true }
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
    })
  );

  app.use(compression());

  app.useStaticAssets(join(__dirname, "..", "files"), {
    prefix: "/files/",
  });

  const port = process.env.PORT;
  // ✅ Must bind to 0.0.0.0 for Railway
  await app.listen(port, "0.0.0.0");
  console.log(`🚀 Server running on port ${port}`);
}

// For traditional server deployment (Railway, Heroku, etc.)
bootstrap().then(() => {
  const port = Number(process.env.PORT) || 3002;
  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Driver API running on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to bootstrap app:', err);
  process.exit(1);
});

// For serverless deployment (keep for backward compatibility)
export default async function handler(req, res) {
  await bootstrap();
  return server(req, res);
}
