import { Module } from '@nestjs/common';
import { MonitoreoService } from './monitoreo.service';
import { ConsumoModule } from '../consumo/consumo.module';
import { EficienciaModule } from '../eficiencia/eficiencia.module';
import { AnomaliasModule } from '../anomalias/anomalias.module';
import { AlertasModule } from '../alertas/alertas.module';
import { EstadoModule } from '../estado/estado.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    ConsumoModule,
    EficienciaModule,
    AnomaliasModule,
    AlertasModule,
    EstadoModule,
    WebSocketModule,
  ],
  providers: [MonitoreoService],
  exports: [MonitoreoService],
})
export class MonitoreoModule {}
