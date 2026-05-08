import { Module } from '@nestjs/common';
import { DetectorAnomaliasService } from './detector-anomalias.service';

@Module({
  providers: [DetectorAnomaliasService],
  exports: [DetectorAnomaliasService],
})
export class AnomaliasModule {}
