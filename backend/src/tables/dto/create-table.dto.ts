import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateTableDto {
  @IsNumber()
  tableNumber: number;

  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}