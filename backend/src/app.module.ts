import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AulasModule } from './modules/aulas/aulas.module';
import { ConsumoModule } from './modules/consumo/consumo.module';
import { EficienciaModule } from './modules/eficiencia/eficiencia.module';
import { AnomaliasModule } from './modules/anomalias/anomalias.module';
import { AlertasModule } from './modules/alertas/alertas.module';
import { EstadoModule } from './modules/estado/estado.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { MonitoreoModule } from './modules/monitoreo/monitoreo.module';
import { HistorialModule } from './modules/historial/historial.module';
import { SeedService } from './common/seed/seed.service';
import { AulasService } from './modules/aulas/aulas.service';

@Module({
  imports: [
    CommonModule,
    AulasModule,
    ConsumoModule,
    EficienciaModule,
    AnomaliasModule,
    AlertasModule,
    EstadoModule,
    WebSocketModule,
    MonitoreoModule,
    HistorialModule,
  ],
  providers: [SeedService, AulasService],
})
export class AppModule {}
