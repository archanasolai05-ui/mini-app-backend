import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {

  @ApiProperty({ example: 'Masala Dosa', description: 'Food item name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Crispy dosa with spiced potato filling', description: 'Food item description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 75, description: 'Price in rupees' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'Breakfast', description: 'Food category' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'https://example.com/dosa.jpg', description: 'Image URL (optional)', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: true, description: 'Is item available (optional)', required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}