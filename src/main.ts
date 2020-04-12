import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = 1946;
  await app.listen(port);
  console.log(`Listening on port ${port}...`);
}
bootstrap();
