import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTableDto {
  @IsOptional()
  @IsNumber()
  tableNumber?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
// ```

// ### What is location?
// ```
// location = where the table is in restaurant
// eg: "Window Side", "Ground Floor", "Rooftop"
// This helps user choose preferred seating