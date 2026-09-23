import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS = Cross-Origin Resource Sharing.
  // The browser blocks requests from one origin (our React app on :5173)
  // to a different origin (this API on :3000) unless the server says
  // "I allow that origin". enableCors() adds those permission headers.
  // Without this, every fetch/axios call from the frontend fails in the browser.
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  const port = parseInt(configService.get<string>('PORT') ?? '3000', 10);

  await app.listen(port);
}

bootstrap();
