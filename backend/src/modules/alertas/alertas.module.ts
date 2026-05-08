import { Module } from '@nestjs/common';
import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';
import { GeneradorAlertasService } from './generador-alertas.service';

@Module({
  controllers: [AlertasController],
  providers: [AlertasService, GeneradorAlertasService],
  exports: [AlertasService, GeneradorAlertasService],
})
export class AlertasModule {}
