import { Module } from '@nestjs/common';
import { PowerTrackGateway } from './powertrack.gateway';

@Module({
  providers: [PowerTrackGateway],
  exports: [PowerTrackGateway],
})
export class WebSocketModule {}
