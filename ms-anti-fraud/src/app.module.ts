import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigModule } from '@config/config.module';
import { LoggingModule } from '@shared/logger/logging.module';

const controllers = [AppController];
const modules = [AppConfigModule, LoggingModule];
@Module({
  imports: [
    ...modules,
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_EMITTER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-microservice-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [...controllers],
  providers: [AppService],
})
export class AppModule {}
