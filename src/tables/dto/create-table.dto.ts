import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {

  @ApiProperty({ example: 5, description: 'Unique table number' })
  @IsNumber()
  tableNumber: number;

  @ApiProperty({ example: 4, description: 'How many people can sit' })
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: 'Window Side', description: 'Table location (optional)', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: true, description: 'Is table available (optional)', required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}