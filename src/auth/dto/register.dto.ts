import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({ example: 'Archana', description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'archana@gmail.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Minimum 6 characters' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '9876543210', description: 'Phone number (optional)', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}