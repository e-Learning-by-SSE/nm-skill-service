import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist ensures that only properties defined by the DTO are accepted, all other will be discarded
      whitelist: true,
      // transform: Default values of DTO shall be initialized correctly: https://stackoverflow.com/a/55480479
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Competence Repository')
    .setDescription('The API description of the Competence Repository.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
