import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.table.findMany({
      orderBy: { tableNumber: 'asc' },
    });
  }

  async findAvailable() {
    return this.prisma.table.findMany({
      where: { isAvailable: true },
      orderBy: { tableNumber: 'asc' },
    });
  }

  async findOne(id: number) {
    const table = await this.prisma.table.findUnique({
      where: { id },
    });
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  async create(dto: CreateTableDto) {
    const existing = await this.prisma.table.findUnique({
      where: { tableNumber: dto.tableNumber },
    });
    if (existing) {
      throw new ConflictException(
        `Table number ${dto.tableNumber} already exists`,
      );
    }
    const table = await this.prisma.table.create({
      data: {
        tableNumber: dto.tableNumber,
        capacity: dto.capacity,
        location: dto.location,
        isAvailable: dto.isAvailable ?? true,
      },
    });
    return {
      message: 'Table created successfully',
      table,
    };
  }

  async update(id: number, dto: UpdateTableDto) {
    await this.findOne(id);
    const table = await this.prisma.table.update({
      where: { id },
      data: dto,
    });
    return {
      message: 'Table updated successfully',
      table,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.table.delete({
      where: { id },
    });
    return {
      message: 'Table deleted successfully',
    };
  }
}