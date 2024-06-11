import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionCommandHandler } from '@application/commands/create-transaction.command';
import { UpdateTransactionCommandHandler } from '@application/commands/update-transaction.command';
import { GetTransactionQueryHandler } from '@application/queries/get-transaction.query';
import { TransactionInfrastructure } from '@infrastructure/transaction.infrastructure';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggingModule } from '@shared/logger/logging.module';

const modules = [CqrsModule, AppConfigModule, LoggingModule];
const controllers = [AppController];
const domain = [];
const application = [
  CreateTransactionCommandHandler,
  UpdateTransactionCommandHandler,
  GetTransactionQueryHandler,
];
const infrastructure = [TransactionInfrastructure];

@Module({
  imports: [
    ...modules,
    ClientsModule.register([
      {
        name: 'TRANSACTION_EMITTER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [...controllers],
  providers: [AppService, ...domain, ...application, ...infrastructure],
})
export class AppModule {}
