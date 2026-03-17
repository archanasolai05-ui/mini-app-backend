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

class OrderItemDto {
  @IsInt()
  menuItemId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsInt()
  tableId?: number;

  // ✅ NEW — for booking conflict check
  @IsOptional()
  @IsDateString()
  date?: string;        // e.g. "2026-03-18"

  @IsOptional()
  @IsString()
  timeSlot?: string;    // e.g. "11:00 AM - 1:00 PM"

  @IsOptional()
  @IsInt()
  @Min(1)
  guestCount?: number;
}