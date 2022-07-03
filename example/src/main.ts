import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";
import { urlencoded, json } from "express";
import { FlawordGuard } from '../../dist'
import { AllExceptionFilter } from "./exception.filter";

process.on("uncaughtException", function (err) {
  console.info("*** uncaughtException ***", err.message);
  console.error(err);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.useGlobalGuards(new FlawordGuard())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: 422,
    })
  );
  app.useGlobalFilters(new AllExceptionFilter())
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
