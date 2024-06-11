import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  configServer(app);
  configSwagger(app, configService);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);

  function configServer(app: INestApplication) {
    app.useLogger(app.get(Logger));
    app.setGlobalPrefix('yape-api');
    app.enableCors();
    app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        consumer: {
          groupId: 'transaction-consumer',
        },
        client: {
          brokers: ['localhost:9092'],
        },
      },
    } as MicroserviceOptions);
  }

  function configSwagger(app: INestApplication, configService: ConfigService) {
    if (configService.get('env') === 'development') {
      const options = new DocumentBuilder()
        .setTitle('Transactions API')
        .setDescription('The transactions API description')
        .setVersion('1.0')
        .addTag('transactions')
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('api', app, document);
    }
  }
}
bootstrap();
