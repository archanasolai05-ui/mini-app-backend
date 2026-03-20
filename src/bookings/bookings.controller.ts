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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  // POST /bookings → User books table
  @ApiOperation({ summary: 'Create a new table booking' })
  @Post()
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, dto);
  }

  // GET /bookings/my → User sees own bookings
  @ApiOperation({ summary: 'Get my bookings' })
  @Get('my')
  findMyBookings(@Request() req) {
    return this.bookingsService.findMyBookings(req.user.id);
  }

  // DELETE /bookings/:id → User cancels own booking
  @ApiOperation({ summary: 'Cancel my booking' })
  @Delete(':id')
  cancelBooking(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.cancelBooking(req.user.id, id);
  }

  // GET /bookings → Admin sees all bookings
  @ApiOperation({ summary: 'Get all bookings — ADMIN only' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // PATCH /bookings/:id/status → Admin updates status
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