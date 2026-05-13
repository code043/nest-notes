import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PATCH,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 8080;
  await app.listen(port);
}
bootstrap();
