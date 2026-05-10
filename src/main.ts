import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: 'GET,POST,PATCH,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
