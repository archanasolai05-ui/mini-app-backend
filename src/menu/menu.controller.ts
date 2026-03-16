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

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  // GET /menu → anyone can view
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  // GET /menu/:id → anyone can view
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  // POST /menu → admin only
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  // PATCH /menu/:id → admin only
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
// ```

// ### Controller Flow Explanation:
// ```
// @Controller('menu')     → base URL is /menu
// @Get()                  → GET /menu
// @Get(':id')             → GET /menu/1
// @Post()                 → POST /menu
// @Patch(':id')           → PATCH /menu/1
// @Delete(':id')          → DELETE /menu/1

// @UseGuards(AuthGuard)   → must be logged in
// @UseGuards(RolesGuard)  → must be correct role
// @Roles('ADMIN')         → only admin allowed

// ParseIntPipe            → converts "1" string to 1 number