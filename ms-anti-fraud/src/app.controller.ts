import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CheckTransactionDto } from '@shared/dtos/check-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('verify-transaction')
  handleEventVerifyTransaction(@Payload() data: CheckTransactionDto) {
    return this.appService.verifyTransaction(data);
  }
}
