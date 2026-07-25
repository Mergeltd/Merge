import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';
import { json } from 'express';

console.log('Starting bootstrap...');
async function bootstrap() {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });

    const app = await NestFactory.create(AppModule);
    
    // Security Hardening
    app.use(helmet());
    app.use(json({ limit: '10mb' })); // Limit payload size to prevent DoS
    
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.listen(process.env.PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
