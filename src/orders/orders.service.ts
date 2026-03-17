import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AdminOrderDto } from './dto/admin-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ─── USER: Place order ────────────────────────────────
  async create(userId: number, dto: CreateOrderDto) {
    // Step 1: Validate all menu items
    const menuItems = await Promise.all(
      dto.items.map(async (item) => {
        const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
        });
        if (!menuItem) {
          throw new NotFoundException(
            `Menu item with id ${item.menuItemId} not found`,
          );
        }
        if (!menuItem.isAvailable) {
          throw new BadRequestException(
            `Menu item ${menuItem.name} is not available`,
          );
        }
        return { menuItem, quantity: item.quantity };
      }),
    );

    // Step 2: Calculate total price
    const totalPrice = menuItems.reduce((sum, item) => {
      return sum + item.menuItem.price * item.quantity;
    }, 0);

    // Step 3: If tableId provided → conflict check + auto create booking
    let bookingId: number | undefined = undefined;

    if (dto.tableId) {
      const table = await this.prisma.table.findUnique({
        where: { id: dto.tableId },
      });

      if (!table) {
        throw new NotFoundException('Table not found');
      }

      if (!table.isAvailable) {
        throw new BadRequestException('Table is not available');
      }

      if (dto.date && dto.timeSlot) {
        // Check conflict
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

        // ✅ Create booking and capture its id
        const booking = await this.prisma.booking.create({
          data: {
            userId,
            tableId:    dto.tableId,
            date:       new Date(dto.date),
            timeSlot:   dto.timeSlot,
            guestCount: dto.guestCount ?? 1,
            status:     'CONFIRMED',
          },
        });

        bookingId = booking.id;
      }
    }

    // Step 4: Create order — link to booking if exists
    const order = await this.prisma.order.create({
      data: {
        userId,
        tableId:   dto.tableId,
        totalPrice,
        // ✅ Link order to booking
        ...(bookingId && { bookingId }),
        items: {
          create: menuItems.map(({ menuItem, quantity }) => ({
            menuItemId: menuItem.id,
            quantity,
            price:      menuItem.price,
          })),
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
        user: {
          select: {
            id:    true,
            name:  true,
            email: true,
          },
        },
        // ✅ Include booking in response
        booking: true,
      },
    });

    return {
      message: 'Order placed successfully',
      order,
    };
  }

  // ─── USER: Get own orders ─────────────────────────────
  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { menuItem: true },
        },
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── USER: Get single order ───────────────────────────
  async findOne(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { menuItem: true },
        },
        booking: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only view your own orders');
    }

    return order;
  }

  // ─── ADMIN: Get all orders ────────────────────────────
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { menuItem: true },
        },
        user: {
          select: {
            id:    true,
            name:  true,
            email: true,
            phone: true,
          },
        },
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── ADMIN: Create order on behalf of user ────────────
  async adminCreate(dto: AdminOrderDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const menuItems = await Promise.all(
      dto.items.map(async (item) => {
        const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
        });
        if (!menuItem) {
          throw new NotFoundException(
            `Menu item with id ${item.menuItemId} not found`,
          );
        }
        if (!menuItem.isAvailable) {
          throw new BadRequestException(
            `Menu item ${menuItem.name} is not available`,
          );
        }
        return { menuItem, quantity: item.quantity };
      }),
    );

    const totalPrice = menuItems.reduce((sum, item) => {
      return sum + item.menuItem.price * item.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        userId:         dto.userId,
        tableId:        dto.tableId,
        totalPrice,
        createdByAdmin: true,
        items: {
          create: menuItems.map(({ menuItem, quantity }) => ({
            menuItemId: menuItem.id,
            quantity,
            price:      menuItem.price,
          })),
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
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
      message: 'Order created successfully on behalf of user',
      order,
    };
  }

  // ─── ADMIN: Update order status ───────────────────────
  async updateStatus(
    orderId: number,
    status: 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED',
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data:  { status },
    });

    return {
      message: `Order status updated to ${status}`,
      order:   updated,
    };
  }
}