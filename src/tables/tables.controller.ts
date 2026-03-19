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
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
// ✅ ADD this import line only
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// ✅ ADD these 2 lines only
@ApiTags('Tables')
@ApiBearerAuth()
@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  // GET /tables → both admin and user
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Get all tables' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  // GET /tables/available → user sees available tables
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Get available tables only' })
  @UseGuards(AuthGuard('jwt'))
  @Get('available')
  findAvailable() {
    return this.tablesService.findAvailable();
  }

  // GET /tables/:id → both admin and user
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Get single table by id' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.findOne(id);
  }

  // POST /tables → admin only
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Create new table — ADMIN only' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  // PATCH /tables/:id → admin only
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Update table — ADMIN only' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
  ) {
    return this.tablesService.update(id, dto);
  }

  // DELETE /tables/:id → admin only
  // ✅ ADD this 1 line only
  @ApiOperation({ summary: 'Delete table — ADMIN only' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.remove(id);
  }
}