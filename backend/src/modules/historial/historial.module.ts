import { Module } from '@nestjs/common';
import { HistorialController } from './historial.controller';
import { EficienciaModule } from '../eficiencia/eficiencia.module';

@Module({
  imports: [EficienciaModule],
  controllers: [HistorialController],
})
export class HistorialModule {}
