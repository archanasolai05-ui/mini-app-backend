import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AdminOrderDto } from './dto/admin-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // POST /orders → User places order
  @Post()
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  // GET /orders/my → User views own orders
  @Get('my')
  findMyOrders(@Request() req) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  // GET /orders/my/:id → User views single order
  @Get('my/:id')
  findOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOne(req.user.id, id);
  }

  // GET /orders → Admin views all orders
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // POST /orders/admin → Admin creates order on behalf
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('admin')
  adminCreate(@Body() dto: AdminOrderDto) {
    return this.ordersService.adminCreate(dto);
  }

  // PATCH /orders/:id/status → Admin updates status
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED',
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}