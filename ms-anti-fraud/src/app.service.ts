import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CheckTransactionDto } from '@shared/dtos/check-transaction.dto';
import { TransactionStatus } from '@config/constants/transaction-status.enum';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_EMITTER') private readonly authClient: ClientKafka,
  ) {}
  verifyTransaction(transaction: CheckTransactionDto) {
    const { transactionExternalId, value } = transaction;
    const status =
      value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;
    return this.authClient.emit(
      'update-transaction',
      JSON.stringify({ transactionExternalId, status }),
    );
  }
}
