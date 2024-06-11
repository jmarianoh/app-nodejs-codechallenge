import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionDto } from '@shared/dtos/create-transaction.dto';
import { CreateTransactionCommand } from '@application/commands/create-transaction.command';
import { UpdateTransactionCommand } from '@application/commands/update-transaction.command';
import { GetTransactionQuery } from '@application/queries/get-transaction.query';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateTransactionDto } from '@shared/dtos/update-transaction.dto';
import { GetTransactionDto } from '@shared/dtos/get-transaction.dto';
import { TransactionCreateResponse } from '@shared/dtos/transaction-create-response.dto';
import {
  BadRequestErrorResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
} from '@shared/exceptions';

@ApiTags('Transaction')
@Controller('transactions')
export class AppController {
  private readonly _logger = new Logger(AppController.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @ApiResponse({
    status: 201,
    description: 'Create new transaction',
    type: TransactionCreateResponse,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponse,
    description: 'Error inputs',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error server',
    type: InternalServerErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'No sessions found',
    type: NotFoundResponse,
  })
  @Post()
  async create(@Body(new ValidationPipe()) body: CreateTransactionDto) {
    this._logger.log('Creating transaction');
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = body;
    const command = new CreateTransactionCommand(
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    );
    return await this.commandBus.execute(command);
  }
  @MessagePattern('update-transaction')
  async handleEventUpdateTransaction(@Payload() data: UpdateTransactionDto) {
    const { transactionExternalId, status } = data;
    const command = new UpdateTransactionCommand(transactionExternalId, status);
    await this.commandBus.execute(command);
  }

  @Get(':transactionExternalId')
  async getTransaction(@Param() params: GetTransactionDto) {
    this._logger.log(`Getting transaction: ${params.transactionExternalId}`);
    const query = new GetTransactionQuery(params.transactionExternalId);
    return await this.queryBus.execute(query);
  }
}
