import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ConfigService } from './config/config.service';
import { InitService } from './init/init.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const initService: InitService = app.get(InitService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  initService.init();

  if (process.env.NODE_ENV !== 'production') {
    const ApiOptions = new DocumentBuilder()
      .setTitle('SPANAI API文档')
      .setDescription('SPANAI API文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const ApiDocument = SwaggerModule.createDocument(app, ApiOptions, {
      include: [AppModule],
    });
    SwaggerModule.setup('swagger', app, ApiDocument);
  }
  await app.listen(config.port);
}
bootstrap();
