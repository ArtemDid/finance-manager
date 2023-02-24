import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './error/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.useGlobalFilters(new ErrorFilter());
  await app.listen(parseInt(process.env.PORT, 10) || 4000);
}
bootstrap();
