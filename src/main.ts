import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { VERSION } from './version';

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
    .setVersion(VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = app.get(ConfigService).get('APP_PORT') ?? 3000;
  console.log(`Starting application on ${port}...`);
  const db_connection = app.get(ConfigService).get('DB_URL');
  console.log(`Connection to DB via ${db_connection}`);
  await app.listen(port);
}
bootstrap();
