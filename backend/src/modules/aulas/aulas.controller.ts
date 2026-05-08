import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CreateAulaDto) {
    return this.aulasService.crearAula(dto);
  }

  @Get()
  obtenerTodas() {
    return this.aulasService.obtenerAulas();
  }

  @Get(':id')
  obtenerUna(@Param('id') id: string) {
    return this.aulasService.obtenerAula(id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateAulaDto) {
    return this.aulasService.actualizarAula(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id') id: string) {
    this.aulasService.eliminarAula(id);
  }
}
