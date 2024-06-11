import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsIn,
} from 'class-validator';
export class CreateTransactionDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    type: 'string',
    example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
    description: 'account external debit id',
    required: true,
  })
  readonly accountExternalIdDebit: string;

  @ApiProperty({
    type: 'string',
    example: '9b0c6238-29ec-4b94-840d-3d71884e0d73',
    description: 'account external credit id',
    required: true,
  })
  @IsString()
  @IsUUID()
  readonly accountExternalIdCredit: string;

  @ApiProperty({ type: 'number', example: 1, description: 'trander type id' })
  @IsInt()
  @IsPositive()
  @IsIn([1, 2, 3])
  readonly tranferTypeId: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'amount of transaction',
  })
  @IsNumber()
  @IsPositive()
  readonly value: number;
}
