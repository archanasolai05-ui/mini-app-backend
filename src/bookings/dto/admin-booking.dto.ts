import { IsNumber, IsString, IsDateString } from 'class-validator';

export class AdminBookingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  tableId: number;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;

  @IsNumber()
  guestCount: number;
}

// ### Why 2 DTOs?
// ```
// CreateBookingDto  → User books for themselves
//                   → userId comes from JWT token
//                   → user cannot change their own userId

// AdminBookingDto   → Admin books on behalf of user
//                   → Admin manually sends userId
//                   → eg: walk-in customer or phone booking