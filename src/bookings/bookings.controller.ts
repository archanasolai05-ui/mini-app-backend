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
// ✅ ADD this import line only
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// ✅ ADD these 2 lines only
@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {  constructor(private bookingsService: BookingsService) {}

  // POST /bookings → User books table
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Create a new table booking' })
  @Post()
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, dto);
  }

  // GET /bookings/my → User sees own bookings
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Get my bookings' })
  @Get('my')
  findMyBookings(@Request() req) {
    return this.bookingsService.findMyBookings(req.user.id);
  }

  // DELETE /bookings/:id → User cancels own booking
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Cancel my booking' })
  @Delete(':id')
  cancelBooking(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.cancelBooking(req.user.id, id);
  }

  // GET /bookings → Admin sees all bookings
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Get all bookings — ADMIN only' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // POST /bookings/admin → Admin books on behalf of user
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Admin creates booking on behalf of user — ADMIN only' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('admin')
  adminCreate(@Body() dto: AdminBookingDto) {
    return this.bookingsService.adminCreate(dto);
  }

  // PATCH /bookings/:id/status → Admin updates status
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Update booking status — ADMIN only' })
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