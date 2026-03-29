import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PORT } from "./config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/exceptions/error.exception";
import { join } from "path";
import * as compression from "compression";
import helmet from "helmet";

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    appOptions,
  );
  app.enableCors({
    origin: [
      "https://ridehailing.com", // your production domain
      "https://www.ridehailing.com", // with www if applicable
      "http://localhost:3000", // for local frontend testing
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    credentials: true, // if you send cookies or Authorization headers
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

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     skipMissingProperties: true,
  //     exceptionFactory: (errors) => {
  //       const message = [];
  //       errors.map((error) => {
  //         message.push(Object.values(error.constraints));
  //       });
  //       return new BadRequestException(message[0][0]);
  //     },
  //   })
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const extractMessages = (validationErrors) => {
          const messages = [];

          for (const error of validationErrors) {
            // collect messages from this level
            if (error.constraints) {
              messages.push(...Object.values(error.constraints));
            }

            // recursively collect from children (nested DTOs)
            if (error.children && error.children.length > 0) {
              messages.push(...extractMessages(error.children));
            }
          }

          return messages;
        };

        const messages = extractMessages(errors);

        // Return first error message (like your original version)
        return new BadRequestException(messages[0] || "Invalid input data.");
      },
    }),
  );

  app.useStaticAssets(join(__dirname, "..", "files"), {
    prefix: "/files/",
  });

  await app.listen(PORT);
}
bootstrap();
