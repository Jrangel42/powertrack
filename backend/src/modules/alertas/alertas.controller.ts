import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlertasService } from './alertas.service';

@Controller('alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Get('activas')
  obtenerActivas() {
    return this.alertasService.getAlertasActivas();
  }

  @Get()
  obtenerTodas(@Query('aulaId') aulaId?: string) {
    return this.alertasService.getAlertas(aulaId);
  }

  @Patch(':id/resolver')
  @HttpCode(HttpStatus.OK)
  resolver(
    @Param('id') id: string,
    @Body() body?: { resolutionNotes?: string }
  ) {
    return this.alertasService.resolverAlerta(id, body?.resolutionNotes);
  }
}
