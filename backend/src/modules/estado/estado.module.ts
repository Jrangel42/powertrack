import { Module } from '@nestjs/common';
import { ClasificadorEstadoService } from './clasificador-estado.service';

@Module({
  providers: [ClasificadorEstadoService],
  exports: [ClasificadorEstadoService],
})
export class EstadoModule {}
