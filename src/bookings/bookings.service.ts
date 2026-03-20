import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ─── USER: Book a table ───────────────────────────────
  async create(userId: number, dto: CreateBookingDto) {
    const table = await this.prisma.table.findUnique({
      where: { id: dto.tableId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (!table.isAvailable) {
      throw new BadRequestException('Table is not available');
    }

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

    if (dto.guestCount > table.capacity) {
      throw new BadRequestException(
        `Table capacity is ${table.capacity} but you requested ${dto.guestCount} guests`,
      );
    }

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
        order: {
          include: {
            items: {
              include: { menuItem: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── USER: Cancel booking → also cancel linked order ──
  async cancelBooking(userId: number, bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { order: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('You can only cancel your own booking');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking already cancelled');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data:  { status: 'CANCELLED' },
    });

    if (booking.order) {
      await this.prisma.order.update({
        where: { id: booking.order.id },
        data:  { status: 'CANCELLED' },
      });
    }

    return {
      message: 'Booking and linked order cancelled successfully',
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
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── ADMIN: Update booking status ────────────────────
  async updateStatus(
    bookingId: number,
    status: 'CONFIRMED' | 'CANCELLED',
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { order: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data:  { status },
    });

    if (status === 'CANCELLED' && booking.order) {
      await this.prisma.order.update({
        where: { id: booking.order.id },
        data:  { status: 'CANCELLED' },
      });
    }

    return {
      message: `Booking ${status.toLowerCase()} successfully`,
      booking: updated,
    };
  }
}