import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {

  @ApiProperty({ example: 1, description: 'Menu item ID' })
  @IsInt()
  menuItemId: number;

  @ApiProperty({ example: 2, description: 'Quantity minimum 1' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {

  @ApiProperty({
    example: [{ menuItemId: 1, quantity: 2 }, { menuItemId: 3, quantity: 1 }],
    description: 'Array of order items minimum 1'
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 3, description: 'Table ID (optional)', required: false })
  @IsOptional()
  @IsInt()
  tableId?: number;

  @ApiProperty({ example: '2026-03-25', description: 'Booking date (optional)', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: '7:00 PM - 9:00 PM', description: 'Time slot (optional)', required: false })
  @IsOptional()
  @IsString()
  timeSlot?: string;

  @ApiProperty({ example: 4, description: 'Guest count minimum 1 (optional)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;
}