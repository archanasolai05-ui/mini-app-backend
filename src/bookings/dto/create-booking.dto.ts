import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  tableId: number;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;

  @IsNumber()
  guestCount: number;
}