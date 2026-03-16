import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AdminBookingDto } from './dto/admin-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  // POST /bookings → User books table
  @Post()
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, dto);
  }

  // GET /bookings/my → User sees own bookings
  @Get('my')
  findMyBookings(@Request() req) {
    return this.bookingsService.findMyBookings(req.user.id);
  }

  // DELETE /bookings/:id → User cancels own booking
  @Delete(':id')
  cancelBooking(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.cancelBooking(req.user.id, id);
  }

  // GET /bookings → Admin sees all bookings
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // POST /bookings/admin → Admin books on behalf of user
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('admin')
  adminCreate(@Body() dto: AdminBookingDto) {
    return this.bookingsService.adminCreate(dto);
  }

  // PATCH /bookings/:id/status → Admin updates status
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'CONFIRMED' | 'CANCELLED',
  ) {
    return this.bookingsService.updateStatus(id, status);
  }
}

// ### Controller Flow Explanation:
// ```
// @UseGuards(AuthGuard('jwt'))  ← on class level
// → means ALL routes need login token

// @UseGuards(RolesGuard)        ← on specific routes
// @Roles('ADMIN')               ← only admin can access

// req.user.id  → comes from JWT token automatically
//              → user cannot fake their own id