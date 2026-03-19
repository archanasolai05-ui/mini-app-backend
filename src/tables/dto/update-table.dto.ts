import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTableDto {

  @ApiProperty({ example: 5, description: 'Table number', required: false })
  @IsOptional()
  @IsNumber()
  tableNumber?: number;

  @ApiProperty({ example: 4, description: 'How many people can sit', required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiProperty({ example: 'Window Side', description: 'Table location eg: Window Side, Rooftop, Ground Floor', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: true, description: 'Is table available', required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}