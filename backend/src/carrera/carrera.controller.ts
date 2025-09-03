import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CarreraService } from './carrera.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('carreras')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) {}

  @Post()
  @Roles(UserRole.SECRETARIA_ACADEMICA, UserRole.ADMIN)
  create(@Body() dto: CreateCarreraDto) {
    return this.carreraService.create(dto);
  }

  @Get()
  findAll() {
    return this.carreraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carreraService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.SECRETARIA_ACADEMICA, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCarreraDto) {
    return this.carreraService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SECRETARIA_ACADEMICA, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.carreraService.remove(+id);
  }
}
