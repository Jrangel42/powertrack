import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InMemoryStore } from '../../common/store/in-memory.store';
import { EficienciaService } from '../eficiencia/eficiencia.service';

@Controller('historial')
export class HistorialController {
  constructor(
    private readonly store: InMemoryStore,
    private readonly eficienciaService: EficienciaService,
  ) {}

  @Get(':aulaId/estadisticas')
  obtenerEstadisticas(@Param('aulaId') aulaId: string) {
    const aula = this.store.getAula(aulaId);
    if (!aula) {
      throw new NotFoundException(`Aula con id "${aulaId}" no encontrada`);
    }
    return this.eficienciaService.calcularEstadisticas(aula.historialConsumo);
  }

  @Get(':aulaId')
  obtenerHistorial(@Param('aulaId') aulaId: string) {
    const aula = this.store.getAula(aulaId);
    if (!aula) {
      throw new NotFoundException(`Aula con id "${aulaId}" no encontrada`);
    }
    return {
      aulaId,
      aulaNombre: aula.nombre,
      historial: aula.historialConsumo,
    };
  }
}
