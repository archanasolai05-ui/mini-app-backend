import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuDto {

  @ApiProperty({ example: 'Masala Dosa', description: 'Food item name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Crispy dosa with spiced potato filling', description: 'Food item description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 75, description: 'Price in rupees', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 'Breakfast', description: 'Food category', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'https://example.com/dosa.jpg', description: 'Image URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: true, description: 'Is item available', required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}