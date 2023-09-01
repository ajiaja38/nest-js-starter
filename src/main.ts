import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/v1');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
  Logger.log(
    `🚀 Application is running on port http://${process.env.HOST}:${process.env.PORT}/v1`,
  );
}
bootstrap();
