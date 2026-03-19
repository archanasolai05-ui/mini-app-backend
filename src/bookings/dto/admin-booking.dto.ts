import { IsNumber, IsString, IsDateString } from 'class-validator';
// ✅ ADD this import line only
import { ApiProperty } from '@nestjs/swagger';

export class AdminBookingDto {

  @ApiProperty({ example: 1, description: 'User ID to book on behalf of' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 3, description: 'Table ID to book' })
  @IsNumber()
  tableId: number;

  @ApiProperty({ example: '2026-03-25', description: 'Booking date' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '7:00 PM - 9:00 PM', description: 'Time slot' })
  @IsString()
  timeSlot: string;

  @ApiProperty({ example: 4, description: 'Number of guests' })
  @IsNumber()
  guestCount: number;
}