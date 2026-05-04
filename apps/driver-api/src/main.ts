import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.DRIVER_API_PORT || 3002);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Driver API running at http://localhost:${port}/graphql`);
}

bootstrap();
