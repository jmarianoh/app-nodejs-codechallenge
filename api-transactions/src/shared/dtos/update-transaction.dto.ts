import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty({
    type: 'string',
    example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
    description: 'transaction external id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'status of transaction',
  })
  @IsString()
  @IsNotEmpty()
  status: number;
}
