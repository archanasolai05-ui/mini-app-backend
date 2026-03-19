import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
// ✅ ADD this import line only
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// ✅ ADD these 2 lines only
@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  // GET /menu → anyone can view
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Get all menu items' })
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  // GET /menu/:id → anyone can view
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Get single menu item by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  // POST /menu → admin only
  // ✅ ADD these 2 lines only
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create menu item — ADMIN only' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  // PATCH /menu/:id → admin only
  // ✅ ADD these 2 lines only
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu item — ADMIN only' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, dto);
  }

  // DELETE /menu/:id → admin only
  // ✅ ADD these 2 lines only
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete menu item — ADMIN only' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}