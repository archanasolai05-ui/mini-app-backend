import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './create-order.dto';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class AdminOrderDto {

  @ApiProperty({ example: 1, description: 'User ID to place order on behalf of' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: [{ menuItemId: 1, quantity: 2 }, { menuItemId: 3, quantity: 1 }],
    description: 'Array of order items'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 3, description: 'Table ID (optional)', required: false })
  @IsOptional()
  @IsNumber()
  tableId?: number;
}