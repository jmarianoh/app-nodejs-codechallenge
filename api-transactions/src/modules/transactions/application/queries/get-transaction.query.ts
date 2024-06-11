import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { TransactionInfrastructure } from '@infrastructure/transaction.infrastructure';
import { TransactionRepository } from '@domain/repositories/transaction.repository';
import { TransactionGetResponse } from '@shared/dtos/transaction-get-response.dto';

export class GetTransactionQuery implements IQuery {
  constructor(public readonly transactionExternalId: string) {}
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery, TransactionGetResponse>
{
  constructor(
    @Inject(TransactionInfrastructure)
    private repository: TransactionRepository,
  ) {}
  async execute(query: GetTransactionQuery): Promise<TransactionGetResponse> {
    const transaction = await this.repository.findById(
      query.transactionExternalId,
    );
    return TransactionGetResponse.fromDomainToResponse(transaction);
  }
}
