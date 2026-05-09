import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE',
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
