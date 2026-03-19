import { IsEmail, IsString } from 'class-validator';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty({
    example: 'archana@gmail.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password'
  })
  @IsString()
  password: string;
}