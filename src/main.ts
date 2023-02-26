import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './lib/middlewares/error/error.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.useGlobalFilters(new ErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Banks example')
    .setDescription('The banks API description')
    .setVersion('1.0')
    .addTag('Banks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT, 10) || 4000);
}
bootstrap();
