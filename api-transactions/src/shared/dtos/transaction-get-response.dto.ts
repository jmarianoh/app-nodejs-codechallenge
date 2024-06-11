import { Transaction } from '@domain/aggregates/transaction';
import { TransactionStatus } from '@config/constants/transactions-status.enum';

export class TransactionGetResponse {
  static fromDomainToResponse(transaction: Transaction) {
    return {
      transactionExternalId: transaction.properties().transactionExternalId,
      transactionType: {
        name: transaction.properties().tranferTypeId,
      },
      transactionStatus: {
        name: TransactionStatus[transaction.properties().status],
      },
      value: transaction.properties().value,
      createdAt: transaction.properties().createdAt,
    };
  }
}
