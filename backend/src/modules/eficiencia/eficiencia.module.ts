import { Module } from '@nestjs/common';
import { EficienciaService } from './eficiencia.service';

@Module({
  providers: [EficienciaService],
  exports: [EficienciaService],
})
export class EficienciaModule {}
