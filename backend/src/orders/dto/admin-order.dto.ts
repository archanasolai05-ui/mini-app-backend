import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './create-order.dto';

export class AdminOrderDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  tableId?: number;
}

// ### Why like this?
// ```
// OrderItemDto    → each item in the order
//                 → menuItemId: which menu item
//                 → quantity: how many

// CreateOrderDto  → user places order
//                 → items: array of OrderItemDto
//                 → tableId: optional (which table)

// AdminOrderDto   → admin places order on behalf
//                 → same as above + userId