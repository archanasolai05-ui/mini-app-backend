import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // GET ALL MENU ITEMS
  async findAll() {
    return this.prisma.menuItem.findMany({
      orderBy: { category: 'asc' },
    });
  }

  // GET SINGLE MENU ITEM
  async findOne(id: number) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  // CREATE MENU ITEM (Admin)
  async create(dto: CreateMenuDto) {
    const item = await this.prisma.menuItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        image: dto.image,
        isAvailable: dto.isAvailable ?? true,
      },
    });

    return {
      message: 'Menu item created successfully',
      item,
    };
  }

  // UPDATE MENU ITEM (Admin)
  async update(id: number, dto: UpdateMenuDto) {
    await this.findOne(id);

    const item = await this.prisma.menuItem.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Menu item updated successfully',
      item,
    };
  }

  // DELETE MENU ITEM (Admin)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.menuItem.delete({
      where: { id },
    });

    return {
      message: 'Menu item deleted successfully',
    };
  }
}
// ```

// ### Service Flow Explanation:
// ```
// findAll()   → get all items ordered by category
// findOne()   → get one item, throw error if not found
// create()    → add new item to DB
// update()    → first check item exists → then update
// remove()    → first check item exists → then delete

// ?? true     → if isAvailable not sent → default true