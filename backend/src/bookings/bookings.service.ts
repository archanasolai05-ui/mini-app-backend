import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AdminBookingDto } from './dto/admin-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ─── USER: Book a table ──────────────────────────────
  async create(userId: number, dto: CreateBookingDto) {
    // Step 1: Check table exists
    const table = await this.prisma.table.findUnique({
      where: { id: dto.tableId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // Step 2: Check table is available
    if (!table.isAvailable) {
      throw new BadRequestException('Table is not available');
    }

    // Step 3: Check if table already booked for same date & timeSlot
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        tableId:  dto.tableId,
        date:     new Date(dto.date),
        timeSlot: dto.timeSlot,
        status:   { not: 'CANCELLED' },
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'Table already booked for this date and time slot',
      );
    }

    // Step 4: Check guest count fits table capacity
    if (dto.guestCount > table.capacity) {
      throw new BadRequestException(
        `Table capacity is ${table.capacity} but you requested ${dto.guestCount} guests`,
      );
    }

    // Step 5: Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        tableId:    dto.tableId,
        date:       new Date(dto.date),
        timeSlot:   dto.timeSlot,
        guestCount: dto.guestCount,
      },
      include: {
        table: true,
        user: {
          select: {
            id:    true,
            name:  true,
            email: true,
          },
        },
      },
    });

    return {
      message: 'Table booked successfully',
      booking,
    };
  }

  // ─── USER: Get own bookings ───────────────────────────
  async findMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── USER: Cancel own booking ─────────────────────────
  async cancelBooking(userId: number, bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // User can only cancel their own booking
    if (booking.userId !== userId) {
      throw new BadRequestException(
        'You can only cancel your own booking',
      );
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking already cancelled');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data:  { status: 'CANCELLED' },
    });

    return {
      message: 'Booking cancelled successfully',
      booking: updated,
    };
  }

  // ─── ADMIN: Get all bookings ──────────────────────────
  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        table: true,
        user: {
          select: {
            id:    true,
            name:  true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── ADMIN: Create booking on behalf of user ──────────
  async adminCreate(dto: AdminBookingDto) {
    // Check user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check table exists
    const table = await this.prisma.table.findUnique({
      where: { id: dto.tableId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // Check table capacity
    if (dto.guestCount > table.capacity) {
      throw new BadRequestException(
        `Table capacity is ${table.capacity} but you requested ${dto.guestCount} guests`,
      );
    }

    // Check already booked
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        tableId:  dto.tableId,
        date:     new Date(dto.date),
        timeSlot: dto.timeSlot,
        status:   { not: 'CANCELLED' },
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'Table already booked for this date and time slot',
      );
    }

    // Create booking with createdByAdmin flag
    const booking = await this.prisma.booking.create({
      data: {
        userId:        dto.userId,
        tableId:       dto.tableId,
        date:          new Date(dto.date),
        timeSlot:      dto.timeSlot,
        guestCount:    dto.guestCount,
        createdByAdmin: true,
        status:        'CONFIRMED',
      },
      include: {
        table: true,
        user: {
          select: {
            id:    true,
            name:  true,
            email: true,
          },
        },
      },
    });

    return {
      message: 'Booking created successfully on behalf of user',
      booking,
    };
  }

  // ─── ADMIN: Update booking status ────────────────────
  async updateStatus(
    bookingId: number,
    status: 'CONFIRMED' | 'CANCELLED',
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data:  { status },
    });

    return {
      message: `Booking ${status.toLowerCase()} successfully`,
      booking: updated,
    };
  }
}