import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { LIB_VERSION } from "./version";
import { urlencoded, json } from "express";

declare global {
    var USE_SEARCH: boolean;
}

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
        .setTitle("Skill Repository")
        .addBearerAuth()
        .setDescription("The API description of the Skill Repository.")
        .setVersion(LIB_VERSION)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.enableCors({ exposedHeaders: "x-total-count" });

    // Increase Payload limit based on: https://stackoverflow.com/a/59978098
    const payloadLimit = app.get(ConfigService).get("MAX_PAYLOAD") ?? "5mb";
    app.use(json({ limit: payloadLimit }));
    app.use(urlencoded({ extended: true, limit: payloadLimit }));

    const port = app.get(ConfigService).get("APP_PORT") ?? 3000;
    console.log(`Starting application on ${port}...`);
    await app.listen(port);
}
bootstrap();
